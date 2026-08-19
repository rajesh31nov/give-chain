"use client";

import React, { useState } from "react";
import { TransactionRecord } from "@/types";
import { formatXLM, getExplorerLink } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2, ExternalLink, RotateCcw, Copy, Check } from "lucide-react";

interface TransactionCardProps {
  tx: TransactionRecord;
  onRetry?: (tx: TransactionRecord) => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ tx, onRetry }) => {
  const [copied, setCopied] = useState(false);

  const copyHash = () => {
    if (tx.hash) {
      navigator.clipboard.writeText(tx.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTimestamp = (ts?: number) => {
    if (!ts) return null;
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getStatusBadge = () => {
    switch (tx.status) {
      case "confirmed":
        return (
          <Badge variant="default" className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all gap-4">
      <div className="space-y-2.5 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {getStatusBadge()}
          <h4 className="text-sm font-bold text-white capitalize">
            {tx.type ? tx.type.replace(/_/g, " ") : "Transaction"}
          </h4>
          {tx.campaignTitle && (
            <span className="text-xs text-slate-400">• {tx.campaignTitle}</span>
          )}
          {tx.timestamp && (
            <span className="text-xs text-slate-500">• {formatTimestamp(tx.timestamp)}</span>
          )}
        </div>

        {tx.amount && (
          <p className="text-xs font-semibold text-emerald-400">
            Amount: {formatXLM(tx.amount)}
          </p>
        )}

        {/* Full Transaction Hash Display */}
        {tx.hash && (
          <div className="flex items-center space-x-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 max-w-full">
            <span className="text-[11px] text-slate-400 font-mono font-medium shrink-0">Full Tx Hash:</span>
            <code className="text-xs font-mono text-cyan-300 break-all select-all flex-1 tracking-tight">
              {tx.hash}
            </code>
            <button
              onClick={copyHash}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors shrink-0"
              title="Copy Full Transaction Hash"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )}

        {tx.error && (
          <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
            {tx.error}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2 shrink-0 self-start sm:self-center">
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
            className="inline-flex items-center space-x-1.5 text-xs text-slate-200 hover:text-emerald-400 border border-slate-700 bg-slate-800/60 px-3.5 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
          >
            <span>Stellar Explorer</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
