import { create } from "zustand";

interface WalletState {
  address: string | null;
  walletName: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  
  // Actions
  setConnecting: (connecting: boolean) => void;
  setConnected: (address: string, walletName?: string) => void;
  setDisconnected: () => void;
  setError: (error: string | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  walletName: null,
  isConnected: false,
  isConnecting: false,
  error: null,

  setConnecting: (connecting) => set({ isConnecting: connecting, error: null }),
  
  setConnected: (address, walletName = "Freighter") =>
    set({
      address,
      walletName,
      isConnected: true,
      isConnecting: false,
      error: null,
    }),

  setDisconnected: () =>
    set({
      address: null,
      walletName: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    }),

  setError: (error) => set({ error, isConnecting: false }),
}));
