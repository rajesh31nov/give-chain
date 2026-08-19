"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { formatXLM } from "@/lib/utils";

interface CampaignPerformanceItem {
  id: string;
  title: string;
  targetAmount: number;
  raisedAmount: number;
  distributedAmount: number;
  progressPercentage: number;
}

interface CampaignPerformanceChartProps {
  data: CampaignPerformanceItem[];
}

export const CampaignPerformanceChart: React.FC<CampaignPerformanceChartProps> = ({ data }) => {
  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
      <div>
        <h3 className="text-base font-bold text-white">Campaign Goal vs Raised Performance</h3>
        <p className="text-xs text-slate-400">On-chain fundraising progress across active charity causes</p>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white truncate max-w-[200px]">{item.title}</span>
              <span className="font-bold text-emerald-400">{item.progressPercentage}%</span>
            </div>

            <Progress value={item.progressPercentage} className="h-2" />

            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Raised: {formatXLM(item.raisedAmount)}</span>
              <span>Goal: {formatXLM(item.targetAmount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
