"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { TxLifecycleStatus } from "@/types";
import { getExplorerLink } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";

interface TransactionStatusBadgeProps {
  status: TxLifecycleStatus;
  hash?: string | null;
  error?: string | null;
}

export const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({
  status,
  hash,
  error,
}) => {
  if (status === "idle") return null;

  if (status === "preparing" || status === "awaiting_wallet" || status === "submitting") {
    return (
      <div className="flex items-center space-x-2 p-3 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300 text-xs animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin shrink-0 text-amber-400" />
        <div>
          <p className="font-semibold capitalize">
            {status === "preparing"
              ? "Preparing Soroban transaction..."
              : status === "awaiting_wallet"
              ? "Awaiting signature in Stellar wallet..."
              : "Submitting transaction to Stellar Testnet..."}
          </p>
          <p className="text-[11px] opacity-80">Please keep your browser window open.</p>
        </div>
      </div>
    );
  }

  if (status === "confirmed") {
    return (
      <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-xs space-y-1">
        <div className="flex items-center space-x-1.5 font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Donation Transaction Confirmed On-Chain!</span>
        </div>
        {hash && (
          <a
            href={getExplorerLink(hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 underline hover:text-emerald-300 transition-colors"
          >
            <span>View on Stellar Expert Explorer</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 text-xs space-y-1">
        <div className="flex items-center space-x-1.5 font-semibold">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          <span>Transaction Failed</span>
        </div>
        <p className="text-[11px] opacity-90">{error || "Transaction was rejected or reverted."}</p>
      </div>
    );
  }

  return null;
};
