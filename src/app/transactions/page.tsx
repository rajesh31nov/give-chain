"use client";

import React from "react";
import { useTransactionCenter } from "@/hooks/useTransactionCenter";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, RefreshCw, Layers } from "lucide-react";

export default function TransactionsPage() {
  const { transactions, retryTx, refreshTransactions } = useTransactionCenter();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Badge variant="default" className="mb-2">Transaction Hub</Badge>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Receipt className="h-7 w-7 text-cyan-400" />
            Transaction Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor submission status, confirmation hashes, and explorer links for all your Soroban transactions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshTransactions}
          className="text-xs border-slate-800 hover:border-slate-700"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1 text-slate-400" />
          <span>Refresh Transactions</span>
        </Button>
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <TransactionCard key={tx.hash} tx={tx} onRetry={retryTx} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <Layers className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Local Transactions Recorded</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your submitted donation and contract transactions will appear here with live confirmation states and direct links to Stellar Expert Explorer.
          </p>
        </div>
      )}
    </div>
  );
}
