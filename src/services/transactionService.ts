import { TransactionRecord, TxLifecycleStatus } from "@/types";
import { getSorobanServer } from "./stellar";
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
    } catch (e) {
      console.warn(`Polling attempt ${attempts + 1} for tx ${hash} failed:`, e);
    }

    attempts++;
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  updateStoredTransactionStatus(
    hash,
    "failed",
    "Transaction confirmation timed out after 15 seconds."
  );
  return false;
};
