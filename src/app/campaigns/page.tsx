"use client";

import React, { useState } from "react";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { useCampaigns } from "@/hooks/useCampaigns";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Layers, AlertCircle } from "lucide-react";
import { isContractConfigured } from "@/config/contracts";

export default function CampaignsPage() {
  const { data: campaigns, isLoading, isError } = useCampaigns();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Emergency", "Medical", "Education"];

  const filteredCampaigns = campaigns?.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || c.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
        <div>
          <Badge variant="default" className="mb-2">Charity Directory</Badge>
          <h1 className="text-3xl font-extrabold text-white">Active Campaigns</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and contribute to verified charity campaigns backed by Soroban fund vaults.
          </p>
        </div>

        {!isContractConfigured() && (
          <div className="flex items-center space-x-2 text-xs bg-slate-900 border border-slate-800 p-3 rounded-xl text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Showing test campaigns. Deploy contracts to connect live Testnet data.</span>
          </div>
        )}
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search campaigns by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Campaign Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredCampaigns && filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <Layers className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Campaigns Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No active campaigns matched your search or category filter. Try clearing your search keywords.
          </p>
        </div>
      )}
    </div>
  );
}
