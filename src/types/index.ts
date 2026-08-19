export enum CampaignStatus {
  Draft = 0,
  Active = 1,
  Paused = 2,
  Completed = 3,
  Cancelled = 4,
}

export interface Campaign {
  id: string;
  owner: string;
  title: string;
  description: string;
  targetAmount: string; // XLM string
  raisedAmount: string; // XLM string
  distributedAmount: string; // XLM string
  status: CampaignStatus;
  createdAt: number;
  category?: string;
  imageUrl?: string;
}

export interface Beneficiary {
  campaignId: string;
  recipient: string;
  allocatedAmount: string;
  receivedAmount: string;
  isApproved: boolean;
}

export interface BatchItem {
  recipient: string;
  amount: string;
}

export interface DistributionBatch {
  batchId: string;
  campaignId: string;
  items: BatchItem[];
  totalAmount: string;
  executed: boolean;
  createdAt: number;
}

export type TxLifecycleStatus =
  | "idle"
  | "preparing"
  | "awaiting_wallet"
  | "submitting"
  | "confirmed"
  | "failed";

export interface TxState {
  status: TxLifecycleStatus;
  hash: string | null;
  error: string | null;
}

export type EventType =
  | "campaign_created"
  | "campaign_status_changed"
  | "donation_received"
  | "batch_distributed"
  | "beneficiary_registered"
  | "beneficiary_approved"
  | "batch_created"
  | "batch_executed";

export interface NormalizedEvent {
  id: string;
  type: EventType;
  timestamp: number;
  ledger: number;
  transactionHash: string;
  contractId: string;
  campaignId: string;
  actor: string;
  amount?: string;
  metadata?: Record<string, any>;
}

export interface TransactionRecord {
  hash: string;
  type: string;
  campaignId?: string;
  campaignTitle?: string;
  amount?: string;
  status: TxLifecycleStatus;
  timestamp: number;
  error?: string | null;
}

export interface AnalyticsSummary {
  totalFundsRaised: string;
  totalFundsDistributed: string;
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalDonationsCount: number;
  averageDonationAmount: string;
  totalBeneficiariesCount: number;
  campaignPerformance: {
    id: string;
    title: string;
    targetAmount: number;
    raisedAmount: number;
    distributedAmount: number;
    progressPercentage: number;
  }[];
  donationTrends: {
    period: string;
    amount: number;
    count: number;
  }[];
  distributionBreakdown: {
    category: string;
    amount: number;
  }[];
}

export interface UserSettings {
  displayCurrency: "XLM" | "USD";
  usdRate: number; // Approximate XLM to USD rate
  enableNotifications: boolean;
  rpcEndpoint: string;
  network: string;
  autoRefreshInterval: number; // in ms
}
