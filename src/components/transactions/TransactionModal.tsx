"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TxLifecycleStatus } from "@/types";
import { getExplorerLink, formatXLM } from "@/lib/utils";
import { CheckCircle2, AlertCircle, X, ExternalLink, Copy, Check, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionModalProps {
  isOpen: boolean;
  status: TxLifecycleStatus;
  hash?: string | null;
  amount?: string;
  campaignTitle?: string;
  error?: string | null;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  status,
  hash,
  amount,
  campaignTitle,
  error,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen && (status === "confirmed" || status === "failed")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, status]);

  if (!isOpen || (status !== "confirmed" && status !== "failed")) {
    return null;
  }

  const copyHash = () => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSuccess = status === "confirmed";

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white">Donation Successful!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your contribution has been recorded on the Stellar Testnet blockchain.
              </p>
            </div>

            {amount && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 inline-block px-6">
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold mb-0.5">
                  Amount Contributed
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {formatXLM(amount)}
                </span>
              </div>
            )}

            {campaignTitle && (
              <div className="flex items-center justify-center space-x-2 text-xs text-slate-300">
                <HeartHandshake className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="truncate max-w-xs">{campaignTitle}</span>
              </div>
            )}

            {hash && (
              <div className="space-y-1.5 text-left bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono font-medium">Transaction Hash:</span>
                  <button
                    onClick={copyHash}
                    className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <code className="block text-xs font-mono text-cyan-300 break-all select-all">
                  {hash}
                </code>
              </div>
            )}

            <div className="pt-2 space-y-2">
              {hash && (
                <a
                  href={getExplorerLink(hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-emerald-900/30"
                >
                  <span>View on Stellar Expert Explorer</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full border-slate-800 hover:border-slate-700 text-slate-300 py-2.5 text-sm"
              >
                Close & Return
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertCircle className="h-10 w-10" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white">Transaction Failed</h3>
              <p className="text-xs text-slate-400 mt-1">
                The transaction could not be completed on Stellar Testnet.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 text-left">
              <p className="font-semibold text-red-400 mb-1">Reason:</p>
              <p className="break-words font-mono text-[11px]">
                {error || "Transaction was rejected or signature was cancelled."}
              </p>
            </div>

            <Button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 text-sm mt-2"
            >
              Close & Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
};
