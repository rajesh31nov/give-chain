import { useState } from "react";
import { useWalletStore } from "@/store/walletStore";
import { useTxStore } from "@/store/txStore";
import { prepareDonationTx, submitSorobanTransaction } from "@/services/contractService";
import { signStellarTransaction } from "@/services/wallet";
import { STELLAR_CONFIG } from "@/config/stellar";
import { isContractConfigured } from "@/config/contracts";

export const useDonation = (campaignId: string) => {
  const { address, isConnected } = useWalletStore();
  const { status, hash, error, setTxStatus, resetTx } = useTxStore();
  const [amount, setAmount] = useState<string>("");

  const executeDonation = async (): Promise<boolean> => {
    if (!isConnected || !address) {
      setTxStatus("failed", null, "Please connect your Stellar wallet first.");
      return false;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setTxStatus("failed", null, "Please enter a valid donation amount greater than 0 XLM.");
      return false;
    }

    if (!isContractConfigured()) {
      setTxStatus(
        "failed",
        null,
        "Soroban contract is not configured in environment settings. Testnet deployment required."
      );
      return false;
    }

    try {
      setTxStatus("preparing");
      const unsignedXdr = await prepareDonationTx(address, campaignId, amount);

      setTxStatus("awaiting_wallet");
      const signedXdr = await signStellarTransaction(
        unsignedXdr,
        STELLAR_CONFIG.networkPassphrase
      );

      setTxStatus("submitting");
      const txHash = await submitSorobanTransaction(signedXdr);

      setTxStatus("confirmed", txHash);
      return true;
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Donation transaction failed.";
      setTxStatus("failed", null, errorMsg);
      return false;
    }
  };

  return {
    amount,
    setAmount,
    status,
    hash,
    error,
    executeDonation,
    resetTx,
  };
};
