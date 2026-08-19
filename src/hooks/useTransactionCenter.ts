import { useState, useEffect, useCallback } from "react";
import { TransactionRecord } from "@/types";
import {
  getStoredTransactions,
  saveTransactionRecord,
  pollTransactionConfirmation,
  getAllTransactionsCombined,
} from "@/services/transactionService";

export const useTransactionCenter = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const combined = await getAllTransactionsCombined();
      setTransactions(combined);
    } catch (e) {
      console.warn("Failed to load combined transactions:", e);
      setTransactions(getStoredTransactions());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const recordNewTx = (tx: TransactionRecord) => {
    saveTransactionRecord(tx);
    refreshTransactions();

    if (tx.status === "submitting" || tx.status === "preparing") {
      pollTransactionConfirmation(tx.hash).then(() => {
        refreshTransactions();
      });
    }
  };

  const retryTx = async (tx: TransactionRecord) => {
    saveTransactionRecord({ ...tx, status: "submitting", error: null });
    refreshTransactions();
    await pollTransactionConfirmation(tx.hash);
    refreshTransactions();
  };

  return {
    transactions,
    isLoading,
    recordNewTx,
    retryTx,
    refreshTransactions,
  };
};
