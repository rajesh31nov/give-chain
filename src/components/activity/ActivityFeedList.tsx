"use client";

import React, { useState } from "react";
import { useActivityFeed } from "@/hooks/useActivityFeed";
import { ActivityItem } from "./ActivityItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, Layers, Filter } from "lucide-react";

interface ActivityFeedListProps {
  campaignIdFilter?: string;
  limit?: number;
}

export const ActivityFeedList: React.FC<ActivityFeedListProps> = ({
  campaignIdFilter,
  limit,
}) => {
  const { data: events, isLoading, isError, refetch, isRefetching } =
    useActivityFeed(campaignIdFilter);

  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredEvents = events?.filter((e) => {
    if (typeFilter === "all") return true;
    if (typeFilter === "donations") return e.type === "donation_received";
    if (typeFilter === "distributions")
      return e.type === "batch_distributed" || e.type === "batch_created" || e.type === "batch_executed";
    if (typeFilter === "beneficiaries")
      return e.type === "beneficiary_approved" || e.type === "beneficiary_registered";
    return true;
  });

  const displayedEvents = limit ? filteredEvents?.slice(0, limit) : filteredEvents;

  return (
    <div className="space-y-4">
      {/* Header controls & filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Event Types:</span>
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {["all", "donations", "distributions", "beneficiaries"].map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setTypeFilter(filterKey)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                  typeFilter === filterKey
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {filterKey}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="text-xs border-slate-800 hover:border-slate-700 justify-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefetching ? "animate-spin text-emerald-400" : "text-slate-400"}`} />
          <span>{isRefetching ? "Syncing..." : "Sync Events"}</span>
        </Button>
      </div>

      {/* Activity list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-900/40 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
          <Clock className="h-8 w-8 text-amber-400 mx-auto" />
          <h4 className="font-bold text-white text-sm">Unable to Query Soroban Events</h4>
          <p className="text-xs text-slate-400">
            Check network RPC connection or try syncing again.
          </p>
        </div>
      ) : displayedEvents && displayedEvents.length > 0 ? (
        <div className="space-y-3">
          {displayedEvents.map((evt) => (
            <ActivityItem key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
          <Layers className="h-8 w-8 text-slate-600 mx-auto" />
          <h4 className="font-bold text-white text-sm">No Events Found</h4>
          <p className="text-xs text-slate-400">
            No contract activity recorded matching the selected filter.
          </p>
        </div>
      )}
    </div>
  );
};
