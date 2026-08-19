"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStellarWallet } from "@/hooks/useStellarWallet";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityFeedList } from "@/components/activity/ActivityFeedList";
import { formatXLM, truncateAddress } from "@/lib/utils";
import {
  Wallet,
  ShieldCheck,
  Building2,
  User,
  PlusCircle,
  BarChart3,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const { isConnected, address, connect } = useStellarWallet();
  const { data: analytics } = useAnalytics();
  const [activeRole, setActiveRole] = useState<"donor" | "charity" | "admin">("donor");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <Badge variant="default" className="mb-2">Portal</Badge>
          <h1 className="text-3xl font-extrabold text-white">GiveChain Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage donations, campaign distributions, and beneficiary approvals.
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveRole("donor")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeRole === "donor"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Donor View</span>
          </button>

          <button
            onClick={() => setActiveRole("charity")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeRole === "charity"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Charity Dashboard</span>
          </button>

          <button
            onClick={() => setActiveRole("admin")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeRole === "admin"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Platform Admin</span>
          </button>
        </div>
      </div>

      {!isConnected || !address ? (
        <Card className="border-slate-800 bg-slate-900/60 p-8 text-center max-w-md mx-auto space-y-4">
          <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 w-fit mx-auto border border-emerald-500/20">
            <Wallet className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Wallet Connection Required</h3>
          <p className="text-xs text-slate-400">
            Connect your Stellar wallet (Freighter) to access your personalized donation history, charity campaign management, and distribution metrics.
          </p>
          <Button onClick={connect} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
            Connect Stellar Wallet
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Connected Wallet Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs text-slate-500">Connected Address</span>
              <p className="font-mono text-sm font-bold text-emerald-400">
                {truncateAddress(address, 6)}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs text-slate-500">Role Mode</span>
              <p className="text-sm font-bold text-white capitalize">{activeRole}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs text-slate-500">Total Platform Impact</span>
              <p className="text-sm font-bold text-emerald-400">
                {formatXLM(analytics?.totalFundsRaised || "0")}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
              <span className="text-xs text-slate-500">Network Status</span>
              <p className="text-sm font-bold text-teal-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Stellar Testnet
              </p>
            </div>
          </div>

          {activeRole === "donor" && (
            <div className="space-y-6">
              <Card className="border-slate-800 bg-slate-900/60">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white">Your Donation Provenance History</CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Track how your contributed XLM moves from campaign vaults into verified beneficiary payout batches.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                    <div className="grid grid-cols-4 bg-slate-950 p-3 font-semibold text-slate-400 border-b border-slate-800">
                      <span>Campaign</span>
                      <span>Amount Donated</span>
                      <span>Status</span>
                      <span>Payout Provenance</span>
                    </div>
                    <div className="p-4 text-center text-slate-500">
                      No active donations recorded yet for address {truncateAddress(address, 4)}. Browse campaigns to contribute!
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Preview */}
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-400" />
                    <span>Recent Live Activity Preview</span>
                  </h3>
                  <Link href="/activity">
                    <Button variant="ghost" size="sm" className="text-xs text-emerald-400 hover:text-emerald-300">
                      View All Activity
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
                <ActivityFeedList limit={3} />
              </div>
            </div>
          )}

          {activeRole === "charity" && (
            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">Charity Campaign & Batch Management</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Create campaigns, register beneficiary Stellar addresses, and execute distribution payouts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <h4 className="font-bold text-white">Create New Soroban Campaign</h4>
                    <p className="text-slate-400">Set fundraising goal and metadata on-chain</p>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500">
                    <PlusCircle className="h-4 w-4 mr-1.5" />
                    Create Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeRole === "admin" && (
            <Card className="border-slate-800 bg-slate-900/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">Platform Administrator Controls</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Verify charity organization credentials and monitor platform-wide analytics.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-slate-400 space-y-2">
                <p>Admin controls active. Contract initialization status verified on Stellar Testnet.</p>
                <Link href="/analytics" className="inline-block text-emerald-400 underline font-semibold">
                  Open Platform Analytics Summary
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
