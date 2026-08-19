"use client";

import React from "react";
import { NormalizedEvent } from "@/types";
import { formatXLM, truncateAddress, getExplorerLink } from "@/lib/utils";
import {
  HeartHandshake,
  CheckCircle2,
  Building2,
  Sparkles,
  Layers,
  ExternalLink,
  Clock,
} from "lucide-react";

interface ActivityItemProps {
  event: NormalizedEvent;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ event }) => {
  const getEventBadge = () => {
    switch (event.type) {
      case "donation_received":
        return {
          icon: HeartHandshake,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          title: "Donation Received",
          desc: event.amount
            ? `${formatXLM(event.amount)} contributed by ${truncateAddress(event.actor, 4)}`
            : `Donation received by campaign`,
        };
      case "batch_distributed":
        return {
          icon: Building2,
          color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
          title: "Funds Distributed",
          desc: event.amount
            ? `${formatXLM(event.amount)} disbursed in Batch #${event.metadata?.batchId || "1"}`
            : `Batch payout executed`,
        };
      case "beneficiary_approved":
        return {
          icon: CheckCircle2,
          color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
          title: "Beneficiary Approved",
          desc: `Stellar address ${truncateAddress(event.actor, 4)} approved for campaign allocations`,
        };
      case "beneficiary_registered":
        return {
          icon: Layers,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          title: "Beneficiary Registered",
          desc: `Address ${truncateAddress(event.actor, 4)} registered for fundraising aid`,
        };
      case "campaign_created":
        return {
          icon: Sparkles,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          title: "Campaign Created",
          desc: `New Soroban charity campaign initialized with target goal ${event.amount ? formatXLM(event.amount) : ""}`,
        };
      default:
        return {
          icon: Clock,
          color: "text-slate-400 bg-slate-800 border-slate-700",
          title: "Blockchain Activity",
          desc: `Soroban contract state updated`,
        };
    }
  };

  const info = getEventBadge();
  const Icon = info.icon;

  const timeAgo = (timestamp: number) => {
    const diff = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="flex items-start justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all group">
      <div className="flex items-start space-x-3.5">
        <div className={`p-2.5 rounded-xl border ${info.color} shrink-0 mt-0.5`}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              {info.title}
            </h4>
            {event.metadata?.campaignTitle && (
              <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                {event.metadata.campaignTitle}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{info.desc}</p>
          <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(event.timestamp)}
            </span>
            <span>•</span>
            <span className="font-mono">Ledger #{event.ledger}</span>
          </div>
        </div>
      </div>

      {event.transactionHash && (
        <a
          href={getExplorerLink(event.transactionHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0 ml-4 transition-colors"
          title="View transaction on Stellar Expert Explorer"
        >
          <span className="hidden sm:inline">Explorer</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
};
