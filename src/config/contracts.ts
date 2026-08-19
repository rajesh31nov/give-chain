export const CONTRACT_CONFIG = {
  campaignContractId:
    process.env.NEXT_PUBLIC_CAMPAIGN_CONTRACT_ID || "",
  distributionContractId:
    process.env.NEXT_PUBLIC_DISTRIBUTION_CONTRACT_ID || "",
  nativeTokenContractId:
    "CDLZFC3SYJYDVR7P6JC4D243OHMYRVCH2W7H32M5CCJM55DQWN53LXER", // Native XLM SAC on Testnet
};

export const isContractConfigured = (): boolean => {
  return (
    !!CONTRACT_CONFIG.campaignContractId &&
    !!CONTRACT_CONFIG.distributionContractId
  );
};
