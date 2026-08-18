use soroban_sdk::{contracttype, Address, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Beneficiary {
    pub campaign_id: u64,
    pub recipient: Address,
    pub allocated_amount: i128,
    pub received_amount: i128,
    pub is_approved: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BatchItem {
    pub recipient: Address,
    pub amount: i128,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BatchRecord {
    pub batch_id: u64,
    pub campaign_id: u64,
    pub items: Vec<BatchItem>,
    pub total_amount: i128,
    pub executed: bool,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BatchVerificationResult {
    pub batch_id: u64,
    pub campaign_id: u64,
    pub items: Vec<BatchItem>,
    pub total_amount: i128,
}
