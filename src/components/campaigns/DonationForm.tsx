"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useStellarWallet } from "@/hooks/useStellarWallet";
import { useDonation } from "@/hooks/useDonation";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { isContractConfigured } from "@/config/contracts";
import { HeartHandshake, AlertCircle, Wallet } from "lucide-react";

interface DonationFormProps {
  campaignId: string;
  campaignTitle: string;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  campaignId,
  campaignTitle,
}) => {
  const { isConnected, connect } = useStellarWallet();
  const { amount, setAmount, status, hash, error, executeDonation, resetTx } =
    useDonation(campaignId);
  const [lastDonatedAmount, setLastDonatedAmount] = useState<string>("");

  const presetAmounts = ["10", "50", "100", "500"];
  const contractReady = isContractConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentAmount = amount;
    setLastDonatedAmount(currentAmount);

    const success = await executeDonation();
    if (success) {
      setAmount(""); // Clears the amount input back to blank
    }
  };

  const handleCloseModal = () => {
    resetTx();
    setAmount(""); // Ensure input is cleared back to blank
  };

  return (
    <>
      <Card className="border-slate-800 bg-slate-900/90 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white">Make a Donation</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Contribute XLM directly to this Soroban campaign vault
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!contractReady && (
            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-300 text-xs flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Testnet Configuration Notice</p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  Soroban campaign contract addresses are not configured in environment variables. Donations will validate UI flow and present environment instructions.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="donation-amount" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select or Enter Amount (XLM)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      amount === preset
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {preset} XLM
                  </button>
                ))}
              </div>

              <div className="relative">
                <Input
                  id="donation-amount"
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="Enter custom amount in XLM"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16 text-base font-semibold"
                  aria-label="Donation amount in XLM"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-500">
                  XLM
                </span>
              </div>
            </div>

            <TransactionStatusBadge status={status} hash={hash} error={error} />

            {!isConnected ? (
              <Button
                type="button"
                onClick={connect}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet to Donate
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={status === "preparing" || status === "awaiting_wallet" || status === "submitting" || !amount}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3"
              >
                Confirm Donation of {amount ? `${amount} XLM` : "XLM"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Transaction Result Modal Popup */}
      <TransactionModal
        isOpen={status === "confirmed" || status === "failed"}
        status={status}
        hash={hash}
        amount={lastDonatedAmount || amount}
        campaignTitle={campaignTitle}
        error={error}
        onClose={handleCloseModal}
      />
    </>
  );
};
