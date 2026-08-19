"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { useCampaigns } from "@/hooks/useCampaigns";
import {
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  Search,
  CheckCircle2,
  Building2,
} from "lucide-react";

export default function LandingPage() {
  const { data: campaigns, isLoading } = useCampaigns();

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="default" className="inline-flex items-center space-x-1.5 py-1.5 px-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Built on Stellar & Soroban Smart Contracts</span>
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Transparent Giving. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Direct On-Chain Impact.
              </span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              GiveChain is a blockchain-powered charity fund distribution platform built on Stellar. Track every dollar from original donation through campaign vaults to verified beneficiary payouts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/campaigns">
                <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 shadow-lg shadow-emerald-500/20">
                  Explore Active Campaigns
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-800 hover:border-slate-700">
                  View Transparency Ledger
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How GiveChain Works */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <Badge variant="secondary">Architecture Flow</Badge>
          <h2 className="text-3xl font-bold text-white">How GiveChain Guarantees Transparency</h2>
          <p className="text-sm text-slate-400">
            End-to-end line of sight from donor contribution to beneficiary payout using Soroban smart contracts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Donor Contribution",
              desc: "Donors contribute XLM or Stellar assets directly to a campaign vault contract via wallet.",
              icon: HeartHandshake,
            },
            {
              step: "02",
              title: "Soroban Vault",
              desc: "Funds are locked safely inside the givechain_campaign Soroban smart contract.",
              icon: ShieldCheck,
            },
            {
              step: "03",
              title: "Batch Verification",
              desc: "Charities submit beneficiary distribution batches validated cross-contract.",
              icon: Building2,
            },
            {
              step: "04",
              title: "Direct Payout",
              desc: "XLM is disbursed directly to approved beneficiary wallets with full Explorer links.",
              icon: CheckCircle2,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/30 transition-all space-y-4"
            >
              <span className="text-3xl font-black text-slate-800 font-mono">{item.step}</span>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/20">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Campaigns Preview */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">Featured Campaigns</Badge>
            <h2 className="text-3xl font-bold text-white">Active Charity Causes</h2>
            <p className="text-sm text-slate-400">Browse verified campaigns on Stellar Testnet</p>
          </div>

          <Link href="/campaigns">
            <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300">
              View All Campaigns ({campaigns?.length || 3})
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaigns?.slice(0, 3).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
