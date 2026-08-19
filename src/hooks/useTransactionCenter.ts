import { useState, useEffect, useCallback } from "react";
import { TransactionRecord } from "@/types";
import {
  getStoredTransactions,
  saveTransactionRecord,
  pollTransactionConfirmation,
} from "@/services/transactionService";

export const useTransactionCenter = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  const refreshTransactions = useCallback(() => {
    setTransactions(getStoredTransactions());
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
    recordNewTx,
    retryTx,
    refreshTransactions,
  };
};
