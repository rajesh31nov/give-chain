"use client";

import React from "react";
import { useStellarWallet } from "@/hooks/useStellarWallet";
import { useSettingsStore } from "@/store/settingsStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STELLAR_CONFIG } from "@/config/stellar";
import { CONTRACT_CONFIG, isContractConfigured } from "@/config/contracts";
import { truncateAddress } from "@/lib/utils";
import {
  Settings,
  Wallet,
  ShieldCheck,
  Globe,
  Bell,
  Sliders,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const { isConnected, address, disconnect } = useStellarWallet();
  const {
    displayCurrency,
    setDisplayCurrency,
    enableNotifications,
    setEnableNotifications,
    autoRefreshInterval,
    setAutoRefreshInterval,
  } = useSettingsStore();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 max-w-4xl">
      <div className="border-b border-slate-800 pb-6">
        <Badge variant="default" className="mb-2">Configuration</Badge>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Settings className="h-7 w-7 text-emerald-400" />
          Application Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your Stellar wallet session, currency preferences, and Soroban network connection.
        </p>
      </div>

      <div className="space-y-6">
        {/* Wallet & Account Settings */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-emerald-400" />
              <span>Wallet Session</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Active Stellar wallet connection status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isConnected && address ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500">Connected Stellar Public Key</span>
                  <p className="font-mono text-sm font-bold text-emerald-400">{address}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 shrink-0"
                >
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>No wallet connected.</span>
                <Badge variant="secondary">Disconnected</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
              <Sliders className="h-5 w-5 text-teal-400" />
              <span>Display Preferences</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Customize currency formatting and event synchronization frequency
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-white">Display Currency</h4>
                <p className="text-xs text-slate-400">Toggle between native XLM and USD reference estimate</p>
              </div>
              <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setDisplayCurrency("XLM")}
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    displayCurrency === "XLM"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-400"
                  }`}
                >
                  XLM
                </button>
                <button
                  onClick={() => setDisplayCurrency("USD")}
                  className={`px-3 py-1 text-xs font-bold rounded ${
                    displayCurrency === "USD"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-400"
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-white">Event Auto-Refresh Interval</h4>
                <p className="text-xs text-slate-400">Polling frequency for Activity Feed and Soroban events</p>
              </div>
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 font-semibold"
              >
                <option value={5000}>5 Seconds (Fast)</option>
                <option value={10000}>10 Seconds (Default)</option>
                <option value={30000}>30 Seconds (Slow)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="text-sm font-semibold text-white">Transaction Toast Notifications</h4>
                <p className="text-xs text-slate-400">Show pop-up status updates when signing or submitting transactions</p>
              </div>
              <input
                type="checkbox"
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Network & Security Settings */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
              <Globe className="h-5 w-5 text-cyan-400" />
              <span>Network & Soroban Configuration</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Active Stellar network RPC endpoints and contract addresses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Stellar Network</span>
              <span className="font-semibold text-emerald-400 uppercase">{STELLAR_CONFIG.network}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Soroban RPC URL</span>
              <span className="font-mono text-slate-200">{STELLAR_CONFIG.sorobanRpcUrl}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Horizon URL</span>
              <span className="font-mono text-slate-200">{STELLAR_CONFIG.horizonUrl}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Soroban Contracts Status</span>
              {isContractConfigured() ? (
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Configured
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  <AlertCircle className="h-3.5 w-3.5" /> Demo Mode (Unconfigured)
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
