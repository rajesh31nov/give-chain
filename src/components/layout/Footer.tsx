import React from "react";
import Link from "next/link";
import { HeartHandshake, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white">GiveChain</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Blockchain-powered charity fund distribution platform built on Stellar and Soroban smart contracts for transparent, verifiable giving.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/campaigns" className="hover:text-emerald-400 transition-colors">
                  Active Campaigns
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Donor Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Stellar Ecosystem</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://developers.stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-emerald-400 transition-colors"
                >
                  <span>Stellar Docs</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://soroban.stellar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-emerald-400 transition-colors"
                >
                  <span>Soroban Smart Contracts</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://stellar.expert/explorer/testnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-emerald-400 transition-colors"
                >
                  <span>Stellar Expert Explorer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GiveChain Protocol. Built on Stellar Testnet.</p>
          <p className="mt-2 sm:mt-0 font-mono">Level 3 Stellar Orange Belt Application</p>
        </div>
      </div>
    </footer>
  );
};
