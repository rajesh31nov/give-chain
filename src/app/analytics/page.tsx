"use client";

import React from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AnalyticsMetricCard } from "@/components/analytics/AnalyticsMetricCard";
import { CampaignPerformanceChart } from "@/components/analytics/CampaignPerformanceChart";
import { DonationTrendChart } from "@/components/analytics/DonationTrendChart";
import { Badge } from "@/components/ui/badge";
import { formatXLM } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  HeartHandshake,
  Building2,
  Users,
  Layers,
  Sparkles,
} from "lucide-react";

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 space-y-6">
        <div className="h-24 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Badge variant="default" className="mb-2">Metrics & Insights</Badge>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-emerald-400" />
            Platform Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Blockchain-derived analytics on donations, campaign performance, and distribution impact.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsMetricCard
          title="Total Funds Raised"
          value={formatXLM(analytics?.totalFundsRaised || "0")}
          subtitle="Cumulative XLM raised across all causes"
          icon={HeartHandshake}
          color="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />

        <AnalyticsMetricCard
          title="Total Funds Distributed"
          value={formatXLM(analytics?.totalFundsDistributed || "0")}
          subtitle="Disbursed directly to approved beneficiaries"
          icon={Building2}
          color="text-teal-400 bg-teal-500/10 border-teal-500/20"
        />

        <AnalyticsMetricCard
          title="Active Causes"
          value={analytics?.activeCampaigns || 0}
          subtitle={`Out of ${analytics?.totalCampaigns || 0} total campaigns`}
          icon={Layers}
          color="text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
        />

        <AnalyticsMetricCard
          title="Beneficiaries Reached"
          value={analytics?.totalBeneficiariesCount || 0}
          subtitle={`Average donation: ${formatXLM(analytics?.averageDonationAmount || "0")}`}
          icon={Users}
          color="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />
      </div>

      {/* Visualization Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analytics?.donationTrends && (
          <DonationTrendChart data={analytics.donationTrends} />
        )}

        {analytics?.campaignPerformance && (
          <CampaignPerformanceChart data={analytics.campaignPerformance} />
        )}
      </div>

      {/* Distribution Category Breakdown */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <span>Category Impact Distribution Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {analytics?.distributionBreakdown.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">{item.category}</span>
              <p className="text-lg font-extrabold text-white">{formatXLM(item.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
