"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStellarWallet } from "@/hooks/useStellarWallet";
import { truncateAddress } from "@/lib/utils";
import { WalletConnectModal } from "./WalletConnectModal";
import { Wallet, LogOut, Copy, Check, ChevronDown } from "lucide-react";

export const WalletButton: React.FC = () => {
  const { address, isConnected, isConnecting, disconnect } = useStellarWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-xs">{truncateAddress(address, 4)}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-xl z-50 animate-in fade-in duration-150">
            <div className="px-2 py-1.5 mb-2 border-b border-slate-800">
              <p className="text-xs text-slate-400">Connected Wallet</p>
              <p className="text-xs font-mono font-medium text-slate-200 truncate mt-0.5">
                {address}
              </p>
              <div className="mt-1 flex items-center space-x-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                  Stellar Testnet
                </span>
              </div>
            </div>

            <button
              onClick={copyAddress}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <span>Copy Public Key</span>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            <button
              onClick={() => {
                disconnect();
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
            >
              <span>Disconnect Wallet</span>
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        disabled={isConnecting}
        className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
      >
        <Wallet className="h-4 w-4" />
        <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
      </Button>

      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
