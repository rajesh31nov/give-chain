import { useWalletStore } from "@/store/walletStore";
import { connectFreighterWallet } from "@/services/wallet";

export const useStellarWallet = () => {
  const {
    address,
    walletName,
    isConnected,
    isConnecting,
    error,
    setConnecting,
    setConnected,
    setDisconnected,
    setError,
  } = useWalletStore();

  const connect = async () => {
    try {
      setConnecting(true);
      const result = await connectFreighterWallet();
      setConnected(result.address, result.walletName);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(msg);
    }
  };

  const disconnect = () => {
    setDisconnected();
  };

  return {
    address,
    walletName,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
  };
};
