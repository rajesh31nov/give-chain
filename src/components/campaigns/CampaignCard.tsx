"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Campaign, CampaignStatus } from "@/types";
import { formatXLM } from "@/lib/utils";
import { HeartHandshake, ArrowRight, ShieldCheck, Tag } from "lucide-react";

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const targetNum = parseFloat(campaign.targetAmount) || 1;
  const raisedNum = parseFloat(campaign.raisedAmount) || 0;
  const percent = Math.min(100, Math.round((raisedNum / targetNum) * 100));

  return (
    <Card className="flex flex-col h-full overflow-hidden border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 group">
      {campaign.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {campaign.category && (
              <Badge variant="secondary" className="bg-slate-950/80 backdrop-blur-md border-slate-700">
                <Tag className="h-3 w-3 mr-1 text-emerald-400" />
                {campaign.category}
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant={campaign.status === CampaignStatus.Active ? "default" : "secondary"}>
              {campaign.status === CampaignStatus.Active ? "Active" : "Draft"}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader className="flex-1 p-5 pb-3">
        <CardTitle className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
          {campaign.title}
        </CardTitle>
        <CardDescription className="text-xs text-slate-400 line-clamp-2 mt-1">
          {campaign.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-5 py-3 space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-400">Fundraising Progress</span>
            <span className="text-emerald-400 font-bold">{percent}%</span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-500 block">Raised</span>
            <span className="font-bold text-white">{formatXLM(campaign.raisedAmount)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Goal</span>
            <span className="font-semibold text-slate-300">{formatXLM(campaign.targetAmount)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t border-slate-800/50 bg-slate-950/40">
        <Link href={`/campaigns/${campaign.id}`} className="w-full">
          <Button variant="outline" className="w-full group/btn justify-between border-slate-800 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400">
            <span className="text-xs font-semibold">View Campaign & Donate</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
