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
