import {
  isConnected as isFreighterConnected,
  requestAccess,
  getAddress,
  signTransaction,
} from "@stellar/freighter-api";

export interface WalletConnectionResult {
  address: string;
  walletName: string;
}

export const connectFreighterWallet = async (): Promise<WalletConnectionResult> => {
  try {
    const connected = await isFreighterConnected();
    if (!connected) {
      throw new Error(
        "Freighter wallet extension is not installed. Please install Freighter from freighter.app."
      );
    }

    const access = await requestAccess();
    if (!access) {
      throw new Error("Wallet access request was rejected by the user.");
    }

    const addrRes = await getAddress();
    const address = typeof addrRes === "string" ? addrRes : addrRes?.address;
    if (!address) {
      throw new Error("Could not retrieve public key address from wallet.");
    }

    return {
      address,
      walletName: "Freighter",
    };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : "Failed to connect to Stellar wallet.";
    throw new Error(errorMsg);
  }
};

export const signStellarTransaction = async (
  xdr: string,
  networkPassphrase: string
): Promise<string> => {
  try {
    const signRes = await signTransaction(xdr, {
      networkPassphrase,
    });
    const signedXdr = typeof signRes === "string" ? signRes : signRes?.signedTxXdr;
    if (!signedXdr) {
      throw new Error("User declined transaction signature.");
    }
    return signedXdr;
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Transaction signing rejected.";
    throw new Error(errorMsg);
  }
};
