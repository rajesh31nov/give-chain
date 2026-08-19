"use client";

import React from "react";
import { TransactionRecord } from "@/types";
import { formatXLM, truncateAddress, getExplorerLink } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2, ExternalLink, RotateCcw } from "lucide-react";

interface TransactionCardProps {
  tx: TransactionRecord;
  onRetry?: (tx: TransactionRecord) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ tx, onRetry }) => {
  const getStatusBadge = () => {
    switch (tx.status) {
      case "confirmed":
        return (
          <Badge variant="default" className="flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>Confirmed</span>
          </Badge>
        );
      case "submitting":
      case "preparing":
      case "awaiting_wallet":
        return (
          <Badge variant="warning" className="flex items-center space-x-1">
            <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
            <span className="capitalize">{tx.status.replace("_", " ")}</span>
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="flex items-center space-x-1">
            <AlertCircle className="h-3 w-3 text-red-400" />
            <span>Failed</span>
          </Badge>
        );
      default:
        return <Badge variant="secondary">Idle</Badge>;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all gap-4">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          <h4 className="text-sm font-bold text-white capitalize">{tx.type}</h4>
          {tx.campaignTitle && (
            <span className="text-xs text-slate-400">• {tx.campaignTitle}</span>
          )}
        </div>

        {tx.amount && (
          <p className="text-xs font-semibold text-emerald-400">
            Amount: {formatXLM(tx.amount)}
          </p>
        )}

        <p className="text-[11px] text-slate-500 font-mono">
          Tx Hash: {truncateAddress(tx.hash, 8)}
        </p>

        {tx.error && (
          <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20 mt-1">
            {tx.error}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        {tx.status === "failed" && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRetry(tx)}
            className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            <span>Retry Tx</span>
          </Button>
        )}

        {tx.hash && (
          <a
            href={getExplorerLink(tx.hash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-xs text-slate-300 hover:text-emerald-400 border border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span>Stellar Explorer</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
