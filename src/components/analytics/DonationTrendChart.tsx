"use client";

import React from "react";
import { formatXLM } from "@/lib/utils";

interface TrendItem {
  period: string;
  amount: number;
  count: number;
}

interface DonationTrendChartProps {
  data: TrendItem[];
}

export const DonationTrendChart: React.FC<DonationTrendChartProps> = ({ data }) => {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
      <div>
        <h3 className="text-base font-bold text-white">Donation Trend & Volume</h3>
        <p className="text-xs text-slate-400">Contribution activity on Stellar Testnet over time</p>
      </div>

      <div className="flex items-end justify-between h-48 pt-4 gap-2 border-b border-slate-800 pb-2">
        {data.map((item, i) => {
          const heightPercent = Math.min(100, Math.max(15, Math.round((item.amount / maxAmount) * 100)));
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="text-[10px] text-slate-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                {formatXLM(item.amount)}
              </div>
              <div className="w-full bg-slate-950 rounded-t-lg overflow-hidden h-36 flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all rounded-t-md"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{item.period}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
