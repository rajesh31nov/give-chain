use soroban_sdk::{contracttype, Address, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum CampaignStatus {
    Draft = 0,
    Active = 1,
    Paused = 2,
    Completed = 3,
    Cancelled = 4,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Campaign {
    pub id: u64,
    pub owner: Address,
    pub title: String,
    pub description: String,
    pub target_amount: i128,
    pub raised_amount: i128,
    pub distributed_amount: i128,
    pub status: CampaignStatus,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BatchItem {
    pub recipient: Address,
    pub amount: i128,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BatchVerificationResult {
    pub batch_id: u64,
    pub campaign_id: u64,
    pub items: Vec<BatchItem>,
    pub total_amount: i128,
}
