"use client";

import React from "react";
import { ActivityFeedList } from "@/components/activity/ActivityFeedList";
import { Badge } from "@/components/ui/badge";
import { Activity, ShieldCheck, Info } from "lucide-react";
import { isContractConfigured } from "@/config/contracts";

export default function ActivityPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Badge variant="default" className="mb-2">Real-Time Ledger</Badge>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Activity className="h-7 w-7 text-emerald-400" />
            Blockchain Activity Feed
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Live stream of Soroban contract events including donations, beneficiary approvals, and batch distributions.
          </p>
        </div>

        {!isContractConfigured() && (
          <div className="flex items-center space-x-2 text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-amber-300">
            <Info className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Displaying normalized test events. Configured contracts query live Stellar RPC ledgers.</span>
          </div>
        )}
      </div>

      <ActivityFeedList />
    </div>
  );
}
