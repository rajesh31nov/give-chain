"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface AnalyticsMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
}

export const AnalyticsMetricCard: React.FC<AnalyticsMetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
}) => {
  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl border ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-extrabold text-white tracking-tight">{value}</h3>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
};
