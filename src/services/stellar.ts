import { rpc } from "@stellar/stellar-sdk";
import { STELLAR_CONFIG } from "@/config/stellar";

export const getSorobanServer = (): rpc.Server => {
  return new rpc.Server(STELLAR_CONFIG.sorobanRpcUrl, {
    allowHttp: STELLAR_CONFIG.sorobanRpcUrl.startsWith("http://"),
  });
};
