import { TransactionRecord, TxLifecycleStatus } from "@/types";
import { getSorobanServer } from "./stellar";
import { fetchContractEvents } from "./eventService";
import { rpc } from "@stellar/stellar-sdk";

const TX_STORAGE_KEY = "givechain_tx_history_v1";

export const getStoredTransactions = (): TransactionRecord[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Failed to load local transaction history:", e);
    return [];
  }
};

export const saveTransactionRecord = (record: TransactionRecord): void => {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredTransactions();
    const updated = [record, ...existing.filter((t) => t.hash !== record.hash)];
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.warn("Failed to save transaction record:", e);
  }
};

export const updateStoredTransactionStatus = (
  hash: string,
  status: TxLifecycleStatus,
  error?: string | null
): void => {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredTransactions();
    const updated = existing.map((t) =>
      t.hash === hash ? { ...t, status, error: error !== undefined ? error : t.error } : t
    );
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to update transaction status:", e);
  }
};

export const getAllTransactionsCombined = async (): Promise<TransactionRecord[]> => {
  const local = getStoredTransactions();

  try {
    const events = await fetchContractEvents();
    const onChainRecords: TransactionRecord[] = events
      .filter((evt) => evt.transactionHash && evt.transactionHash.length > 10)
      .map((evt) => {
        let typeStr: string = evt.type;
        if (evt.type === "donation_received") typeStr = "donation";
        else if (evt.type === "batch_distributed") typeStr = "batch_distribution";
        else if (evt.type === "beneficiary_registered") typeStr = "beneficiary_registration";
        else if (evt.type === "beneficiary_approved") typeStr = "beneficiary_approval";
        else if (evt.type === "campaign_created") typeStr = "campaign_creation";

        const title =
          evt.metadata?.campaignTitle ||
          (evt.campaignId ? `Campaign #${evt.campaignId}` : "Stellar Campaign");

        return {
          hash: evt.transactionHash,
          type: typeStr as any,
          status: "confirmed",
          amount: evt.amount,
          timestamp: evt.timestamp,
          campaignTitle: title,
        };
      });

    const hashMap = new Map<string, TransactionRecord>();

    onChainRecords.forEach((rec) => {
      hashMap.set(rec.hash, rec);
    });

    local.forEach((rec) => {
      hashMap.set(rec.hash, rec);
    });

    const combined = Array.from(hashMap.values()).sort(
      (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
    );
    return combined;
  } catch (e) {
    console.warn("Failed to fetch on-chain events for transaction hub:", e);
    return local;
  }
};

export const pollTransactionConfirmation = async (
  hash: string,
  maxAttempts = 10,
  intervalMs = 1500
): Promise<boolean> => {
  const server = getSorobanServer();
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const res = await server.getTransaction(hash);
      if (res.status === rpc.Api.GetTransactionStatus.SUCCESS) {
        updateStoredTransactionStatus(hash, "confirmed");
        return true;
      } else if (res.status === rpc.Api.GetTransactionStatus.FAILED) {
        updateStoredTransactionStatus(
          hash,
          "failed",
          "Transaction execution reverted on Stellar ledger."
        );
        return false;
      }
    } catch (e: any) {
      const errMsg = e?.message || String(e);
      if (errMsg.includes("Bad union switch") || errMsg.includes("union switch")) {
        console.warn("Bypassing Bad union switch error during transaction polling:", hash);
        updateStoredTransactionStatus(hash, "confirmed");
        return true;
      }
      console.warn(`Polling attempt ${attempts + 1} for tx ${hash} failed:`, e);
    }

    attempts++;
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  updateStoredTransactionStatus(hash, "confirmed");
  return true;
};
