import { create } from "zustand";
import { TxLifecycleStatus, TxState } from "@/types";

interface TxStoreState extends TxState {
  setTxStatus: (status: TxLifecycleStatus, hash?: string | null, error?: string | null) => void;
  resetTx: () => void;
}

export const useTxStore = create<TxStoreState>((set) => ({
  status: "idle",
  hash: null,
  error: null,

  setTxStatus: (status, hash = null, error = null) =>
    set({ status, hash, error }),

  resetTx: () => set({ status: "idle", hash: null, error: null }),
}));
