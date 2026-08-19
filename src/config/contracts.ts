export const CONTRACT_CONFIG = {
  campaignContractId:
    process.env.NEXT_PUBLIC_CAMPAIGN_CONTRACT_ID ||
    "CDCZBBHKFAUSZO7JEGSQ3VAFFD3CZ3VI4THB4SWZWOGATZ4LNGGUN3BF",
  distributionContractId:
    process.env.NEXT_PUBLIC_DISTRIBUTION_CONTRACT_ID ||
    "CDFLHHBOOH4WBNTLDVSGMMVDJRYFKDCS63KTUK4IUEVY6TGOV7KQY5XO",
};

export const isContractConfigured = (): boolean => {
  return (
    CONTRACT_CONFIG.campaignContractId.length > 0 &&
    CONTRACT_CONFIG.campaignContractId.startsWith("C")
  );
};
