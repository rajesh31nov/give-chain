import { Address, Contract, rpc, scValToNative } from "@stellar/stellar-sdk";
import { getSorobanServer } from "./stellar";
import { CONTRACT_CONFIG, isContractConfigured } from "@/config/contracts";
import { NormalizedEvent, EventType } from "@/types";

// Realistic demo event history used when contracts are not yet deployed on Testnet
export const DEMO_EVENTS: NormalizedEvent[] = [
  {
    id: "tx-demo-101-0-1",
    type: "donation_received",
    timestamp: Date.now() - 1000 * 60 * 2, // 2 mins ago
    ledger: 1048201,
    transactionHash: "a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890",
    contractId: "CCAMP...GIVECHAIN",
    campaignId: "1",
    actor: "GABC...DONOR1",
    amount: "100",
    metadata: { campaignTitle: "Flood Relief 2026" },
  },
  {
    id: "tx-demo-102-0-1",
    type: "batch_distributed",
    timestamp: Date.now() - 1000 * 60 * 8, // 8 mins ago
    ledger: 1048195,
    transactionHash: "b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1",
    contractId: "CCAMP...GIVECHAIN",
    campaignId: "1",
    actor: "GCHARITY...OWNER1",
    amount: "300",
    metadata: { batchId: "1", campaignTitle: "Flood Relief 2026" },
  },
  {
    id: "tx-demo-103-0-1",
    type: "beneficiary_approved",
    timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
    ledger: 1048180,
    transactionHash: "c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2",
    contractId: "CDIST...GIVECHAIN",
    campaignId: "1",
    actor: "GBENEFICIARY...WALLET1",
    metadata: { campaignTitle: "Flood Relief 2026" },
  },
  {
    id: "tx-demo-104-0-1",
    type: "donation_received",
    timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
    ledger: 1048150,
    transactionHash: "d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3",
    contractId: "CCAMP...GIVECHAIN",
    campaignId: "2",
    actor: "GABC...DONOR2",
    amount: "50",
    metadata: { campaignTitle: "Medical Aid Fund" },
  },
  {
    id: "tx-demo-105-0-1",
    type: "campaign_created",
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    ledger: 1048000,
    transactionHash: "e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4",
    contractId: "CCAMP...GIVECHAIN",
    campaignId: "1",
    actor: "GCHARITY...OWNER1",
    amount: "5000",
    metadata: { campaignTitle: "Flood Relief 2026" },
  },
];

export const deduplicateEvents = (events: NormalizedEvent[]): NormalizedEvent[] => {
  const seen = new Set<string>();
  const result: NormalizedEvent[] = [];

  for (const event of events) {
    if (!seen.has(event.id)) {
      seen.add(event.id);
      result.push(event);
    }
  }

  return result;
};

export const normalizeSorobanEvent = (
  rawEvent: any,
  index: number
): NormalizedEvent | null => {
  try {
    const txHash = rawEvent.txHash || rawEvent.id || `evt-${rawEvent.ledger}-${index}`;
    const ledger = rawEvent.ledger || 0;
    const contractId = rawEvent.contractId || "";
    const id = `${txHash}-${ledger}-${index}`;

    if (!rawEvent.topic) return null;
    const topicVals = rawEvent.topic.map((t: any) => scValToNative(t));
    if (topicVals.length < 2) return null;

    const domain = topicVals[0]?.toString();
    const action = topicVals[1]?.toString();
    const dataNative = rawEvent.value ? scValToNative(rawEvent.value) : null;

    let type: EventType | null = null;
    let campaignId = "1";
    let actor = "";
    let amount: string | undefined;
    const metadata: Record<string, any> = {};

    if (domain === "campaign") {
      if (action === "created") {
        type = "campaign_created";
        if (Array.isArray(dataNative)) {
          campaignId = dataNative[0]?.toString() || "1";
          actor = dataNative[1]?.toString() || "";
          amount = (Number(dataNative[2]) / 10000000).toString();
        }
      } else if (action === "status") {
        type = "campaign_status_changed";
        if (Array.isArray(dataNative)) {
          campaignId = dataNative[0]?.toString() || "1";
        }
      } else if (action === "donated") {
        type = "donation_received";
        if (Array.isArray(dataNative)) {
          campaignId = dataNative[0]?.toString() || "1";
          actor = dataNative[1]?.toString() || "";
          amount = (Number(dataNative[2]) / 10000000).toString();
        }
      } else if (action === "distrib") {
        type = "batch_distributed";
        if (Array.isArray(dataNative)) {
          campaignId = dataNative[0]?.toString() || "1";
          metadata.batchId = dataNative[1]?.toString();
          amount = (Number(dataNative[2]) / 10000000).toString();
        }
      }
    } else if (domain === "beneficiary") {
      if (action === "reg") {
        type = "beneficiary_registered";
        if (Array.isArray(dataNative)) {
          campaignId = dataNative[0]?.toString() || "1";
          actor = dataNative[1]?.toString() || "";
          amount = (Number(dataNative[2]) / 10000000).toString();
        }
      } else if (action === "approved") {
        type = "beneficiary_approved";
        if (Array.isArray(dataNative)) {
          campaignId = dataNative[0]?.toString() || "1";
          actor = dataNative[1]?.toString() || "";
        }
      }
    } else if (domain === "batch") {
      if (action === "created") {
        type = "batch_created";
        if (Array.isArray(dataNative)) {
          campaignId = dataNative[0]?.toString() || "1";
          metadata.batchId = dataNative[1]?.toString();
          amount = (Number(dataNative[2]) / 10000000).toString();
        }
      } else if (action === "executed") {
        type = "batch_executed";
        if (Array.isArray(dataNative)) {
          campaignId = dataNative[0]?.toString() || "1";
          metadata.batchId = dataNative[1]?.toString();
        }
      }
    }

    if (!type) return null;

    return {
      id,
      type,
      timestamp: rawEvent.ledgerClosedAt
        ? new Date(rawEvent.ledgerClosedAt).getTime()
        : Date.now(),
      ledger,
      transactionHash: txHash,
      contractId,
      campaignId,
      actor,
      amount,
      metadata,
    };
  } catch (err) {
    console.warn("Failed to normalize raw Soroban event:", err);
    return null;
  }
};

export const fetchContractEvents = async (
  campaignIdFilter?: string
): Promise<NormalizedEvent[]> => {
  if (!isContractConfigured()) {
    if (campaignIdFilter) {
      return DEMO_EVENTS.filter((e) => e.campaignId === campaignIdFilter);
    }
    return DEMO_EVENTS;
  }

  try {
    const server = getSorobanServer();
    const latestLedger = await server.getLatestLedger();
    const startLedger = Math.max(1, latestLedger.sequence - 1000);

    const validContractIds = [
      CONTRACT_CONFIG.campaignContractId,
      CONTRACT_CONFIG.distributionContractId,
    ].filter((id) => typeof id === "string" && id.length > 0);

    const getEventsRequest: any = {
      startLedger,
      filters: [
        {
          type: "contract",
          contractIds: validContractIds,
        },
      ],
      limit: 50,
    };

    const res = await server.getEvents(getEventsRequest);

    const normalizedList: NormalizedEvent[] = [];
    if (res && res.events) {
      res.events.forEach((rawEvt: any, i: number) => {
        const norm = normalizeSorobanEvent(rawEvt, i);
        if (norm) normalizedList.push(norm);
      });
    }

    const deduped = deduplicateEvents(normalizedList);
    if (campaignIdFilter) {
      return deduped.filter((e) => e.campaignId === campaignIdFilter);
    }
    return deduped.length > 0 ? deduped : DEMO_EVENTS;
  } catch (err) {
    console.warn("Error querying Soroban events, falling back to demo feed:", err);
    if (campaignIdFilter) {
      return DEMO_EVENTS.filter((e) => e.campaignId === campaignIdFilter);
    }
    return DEMO_EVENTS;
  }
};
