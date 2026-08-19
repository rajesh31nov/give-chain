"use client";

import React, { use } from "react";
import Link from "next/link";
import { useCampaignDetails } from "@/hooks/useCampaigns";
import { DonationForm } from "@/components/campaigns/DonationForm";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatXLM } from "@/lib/utils";
import {
  ArrowLeft,
  Building2,
  ShieldCheck,
  TrendingUp,
  Tag,
  Share2,
} from "lucide-react";

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: campaign, isLoading } = useCampaignDetails(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="h-96 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Campaign Not Found</h2>
        <p className="text-sm text-slate-400">The requested campaign does not exist or has been removed.</p>
        <Link href="/campaigns" className="inline-block text-emerald-400 underline text-sm">
          Return to Campaigns Directory
        </Link>
      </div>
    );
  }

  const targetNum = parseFloat(campaign.targetAmount) || 1;
  const raisedNum = parseFloat(campaign.raisedAmount) || 0;
  const distributedNum = parseFloat(campaign.distributedAmount) || 0;
  const remainingNum = Math.max(0, raisedNum - distributedNum);
  const percent = Math.min(100, Math.round((raisedNum / targetNum) * 100));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/campaigns"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Campaigns</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="default">Active Campaign</Badge>
              {campaign.category && (
                <Badge variant="secondary">
                  <Tag className="h-3 w-3 mr-1 text-emerald-400" />
                  {campaign.category}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{campaign.title}</h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-slate-500" />
              <span>Organized by Charity Address: {campaign.owner}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Image, Description, Progress Stats */}
        <div className="lg:col-span-2 space-y-6">
          {campaign.imageUrl && (
            <div className="h-80 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-lg font-bold text-white">About This Cause</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {campaign.description}
            </p>
          </div>

          {/* Campaign Financial Summary Card */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center justify-between">
              <span>On-Chain Vault Accounting</span>
              <span className="text-emerald-400 text-sm font-semibold">{percent}% Funded</span>
            </h3>

            <Progress value={percent} className="h-3" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-1">Target Goal</span>
                <span className="font-bold text-sm text-white">{formatXLM(campaign.targetAmount)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-1">Total Raised</span>
                <span className="font-bold text-sm text-emerald-400">{formatXLM(campaign.raisedAmount)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-1">Distributed</span>
                <span className="font-bold text-sm text-teal-400">{formatXLM(campaign.distributedAmount)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block mb-1">Vault Balance</span>
                <span className="font-bold text-sm text-amber-400">{formatXLM(remainingNum)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Donation Form */}
        <div className="space-y-6">
          <DonationForm campaignId={campaign.id} campaignTitle={campaign.title} />

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-xs text-slate-400 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Verifiable Stellar Ledger</span>
            </div>
            <p>
              100% of your contribution is deposited directly into the Soroban smart contract vault.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
