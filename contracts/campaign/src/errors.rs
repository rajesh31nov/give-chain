use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    CampaignNotFound = 4,
    CampaignNotActive = 5,
    InvalidAmount = 6,
    InsufficientFunds = 7,
    InvalidStateTransition = 8,
    GoalAlreadyReached = 9,
    ZeroAddress = 10,
    CrossContractCallFailed = 11,
}
