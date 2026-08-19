"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useStellarWallet } from "@/hooks/useStellarWallet";
import { Wallet, Shield, AlertCircle, X, ExternalLink } from "lucide-react";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { connect, isConnecting, error } = useStellarWallet();

  if (!isOpen) return null;

  const handleConnect = async () => {
    await connect();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
            <p className="text-sm text-slate-400">
              Select a Stellar wallet to sign transactions
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start space-x-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-emerald-500/40 transition-all text-left group disabled:opacity-50"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400">
                F
              </div>
              <div>
                <h4 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  Freighter Wallet
                </h4>
                <p className="text-xs text-slate-400">
                  Recommended for Soroban dApps
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Installed / Supported
            </span>
          </button>

          <a
            href="https://freighter.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between p-3 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span>Don&apos;t have Freighter installed?</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <span>Install Freighter</span>
              <ExternalLink className="h-3 w-3" />
            </span>
          </a>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 border-t border-slate-800/80 pt-4">
          <Shield className="h-4 w-4 shrink-0 text-emerald-500/70" />
          <span>
            GiveChain never accesses your private keys or seed phrase. All transactions are signed safely inside your wallet.
          </span>
        </div>
      </div>
    </div>
  );
};
