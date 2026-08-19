import { create } from "zustand";
import { UserSettings } from "@/types";
import { STELLAR_CONFIG } from "@/config/stellar";

interface SettingsState extends UserSettings {
  setDisplayCurrency: (currency: "XLM" | "USD") => void;
  setEnableNotifications: (enable: boolean) => void;
  setAutoRefreshInterval: (ms: number) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  displayCurrency: "XLM",
  usdRate: 0.12, // 1 XLM ~ $0.12 USD reference estimate
  enableNotifications: true,
  rpcEndpoint: STELLAR_CONFIG.sorobanRpcUrl,
  network: STELLAR_CONFIG.network,
  autoRefreshInterval: 10000,
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...DEFAULT_SETTINGS,

  setDisplayCurrency: (displayCurrency) => set({ displayCurrency }),
  setEnableNotifications: (enableNotifications) => set({ enableNotifications }),
  setAutoRefreshInterval: (autoRefreshInterval) => set({ autoRefreshInterval }),
  resetSettings: () => set({ ...DEFAULT_SETTINGS }),
}));
