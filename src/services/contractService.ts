import {
  Address,
  Contract,
  TransactionBuilder,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";
import { STELLAR_CONFIG } from "@/config/stellar";
import { CONTRACT_CONFIG, isContractConfigured } from "@/config/contracts";
import { Campaign, CampaignStatus } from "@/types";
import { getSorobanServer } from "./stellar";

// Realistic demo campaigns used when contracts are not yet deployed on Testnet
export const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    owner: "GAYC...CHARITY1",
    title: "Flood Relief 2026",
    description: "Emergency food, clean water, and shelter supplies for flood victims across affected regions.",
    targetAmount: "5000",
    raisedAmount: "2150",
    distributedAmount: "1200",
    status: CampaignStatus.Active,
    createdAt: Date.now() - 86400000 * 5,
    category: "Emergency",
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    owner: "GAYC...CHARITY2",
    title: "Medical Aid Fund",
    description: "Providing essential medicines, surgical equipment, and health clinic support for rural areas.",
    targetAmount: "3000",
    raisedAmount: "1800",
    distributedAmount: "950",
    status: CampaignStatus.Active,
    createdAt: Date.now() - 86400000 * 10,
    category: "Medical",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    owner: "GAYC...CHARITY3",
    title: "Education Support",
    description: "Funding textbooks, laptops, and classroom infrastructure for underprivileged youth.",
    targetAmount: "2500",
    raisedAmount: "900",
    distributedAmount: "400",
    status: CampaignStatus.Active,
    createdAt: Date.now() - 86400000 * 3,
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
  },
];

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  if (!isContractConfigured()) {
    return DEMO_CAMPAIGNS;
  }

  try {
    const server = getSorobanServer();
    const contract = new Contract(CONTRACT_CONFIG.campaignContractId);
    
    const countTx = new TransactionBuilder(
      await server.getAccount(CONTRACT_CONFIG.campaignContractId),
      {
        fee: "100",
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      }
    )
      .addOperation(contract.call("get_campaign_count"))
      .setTimeout(30)
      .build();

    const simRes = await server.simulateTransaction(countTx);
    if (rpc.Api.isSimulationSuccess(simRes) && simRes.result) {
      const count = Number(scValToNative(simRes.result.retval));
      const campaigns: Campaign[] = [];

      for (let i = 1; i <= count; i++) {
        const campaign = await fetchCampaignById(i.toString());
        if (campaign) campaigns.push(campaign);
      }
      return campaigns.length > 0 ? campaigns : DEMO_CAMPAIGNS;
    }
  } catch (e) {
    console.warn("Failed to fetch campaigns from contract, falling back to demo campaigns:", e);
  }

  return DEMO_CAMPAIGNS;
};

export const fetchCampaignById = async (id: string): Promise<Campaign | null> => {
  if (!isContractConfigured()) {
    return DEMO_CAMPAIGNS.find((c) => c.id === id) || null;
  }

  try {
    const server = getSorobanServer();
    const contract = new Contract(CONTRACT_CONFIG.campaignContractId);
    
    const readTx = new TransactionBuilder(
      await server.getAccount(CONTRACT_CONFIG.campaignContractId),
      {
        fee: "100",
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      }
    )
      .addOperation(contract.call("get_campaign", xdr.ScVal.scvU64(new xdr.Uint64(BigInt(id)))))
      .setTimeout(30)
      .build();

    const simRes = await server.simulateTransaction(readTx);
    if (rpc.Api.isSimulationSuccess(simRes) && simRes.result) {
      const nativeData = scValToNative(simRes.result.retval);
      if (!nativeData) return null;

      return {
        id: nativeData.id.toString(),
        owner: nativeData.owner,
        title: nativeData.title,
        description: nativeData.description,
        targetAmount: (Number(nativeData.target_amount) / 10000000).toString(),
        raisedAmount: (Number(nativeData.raised_amount) / 10000000).toString(),
        distributedAmount: (Number(nativeData.distributed_amount) / 10000000).toString(),
        status: nativeData.status as CampaignStatus,
        createdAt: Number(nativeData.created_at) * 1000,
      };
    }
  } catch (e) {
    console.warn(`Error fetching campaign #${id}:`, e);
  }

  return DEMO_CAMPAIGNS.find((c) => c.id === id) || null;
};

export const prepareDonationTx = async (
  donorAddress: string,
  campaignId: string,
  amountXlm: string
): Promise<string> => {
  if (!isContractConfigured()) {
    throw new Error(
      "GiveChain Soroban contract addresses are not configured in environment variables. Please configure NEXT_PUBLIC_CAMPAIGN_CONTRACT_ID."
    );
  }

  const server = getSorobanServer();
  const account = await server.getAccount(donorAddress);
  const contract = new Contract(CONTRACT_CONFIG.campaignContractId);

  const stroops = BigInt(Math.floor(parseFloat(amountXlm) * 10000000));
  const lo = new xdr.Uint64(stroops);
  const hi = new xdr.Int64(BigInt(0));

  const tx = new TransactionBuilder(account, {
    fee: "10000",
    networkPassphrase: STELLAR_CONFIG.networkPassphrase,
  })
    .addOperation(
      contract.call(
        "donate",
        new Address(donorAddress).toScVal(),
        xdr.ScVal.scvU64(new xdr.Uint64(BigInt(campaignId))),
        xdr.ScVal.scvI128(new xdr.Int128Parts({ hi, lo }))
      )
    )
    .setTimeout(30)
    .build();

  const preparedTx = await server.prepareTransaction(tx);
  return preparedTx.toXDR();
};

export const submitSorobanTransaction = async (signedXdr: string): Promise<string> => {
  const server = getSorobanServer();
  const tx = TransactionBuilder.fromXDR(signedXdr, STELLAR_CONFIG.networkPassphrase);
  
  const sendRes = await server.sendTransaction(tx);
  const statusStr = String(sendRes.status);
  if (statusStr === "PENDING" || statusStr === "SUCCESS") {
    let statusRes = await server.getTransaction(sendRes.hash);
    let attempts = 0;
    while (statusRes.status === rpc.Api.GetTransactionStatus.NOT_FOUND && attempts < 10) {
      await new Promise((r) => setTimeout(r, 1000));
      statusRes = await server.getTransaction(sendRes.hash);
      attempts++;
    }
    return sendRes.hash;
  } else {
    throw new Error(`Soroban transaction submission failed: ${sendRes.status}`);
  }
};
