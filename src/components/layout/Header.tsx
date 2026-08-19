"use client";

import React from "react";
import Link from "next/link";
import { WalletButton } from "@/components/wallet/WalletButton";
import {
  HeartHandshake,
  ShieldCheck,
  LayoutDashboard,
  Layers,
  Activity,
  Receipt,
  BarChart3,
  Settings,
} from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                GiveChain
                <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Soroban
                </span>
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-5">
            <Link
              href="/campaigns"
              className="flex items-center space-x-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>Campaigns</span>
            </Link>

            <Link
              href="/activity"
              className="flex items-center space-x-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Activity className="h-4 w-4 text-teal-400" />
              <span>Activity</span>
            </Link>

            <Link
              href="/transactions"
              className="flex items-center space-x-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Receipt className="h-4 w-4 text-cyan-400" />
              <span>Transactions</span>
            </Link>

            <Link
              href="/analytics"
              className="flex items-center space-x-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <BarChart3 className="h-4 w-4 text-amber-400" />
              <span>Analytics</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center space-x-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-purple-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center space-x-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Stellar Testnet</span>
          </div>

          <WalletButton />
        </div>
      </div>
    </header>
  );
};
