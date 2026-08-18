use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    Unauthorized = 3,
    BeneficiaryNotFound = 4,
    BeneficiaryNotApproved = 5,
    BeneficiaryAlreadyApproved = 6,
    BatchNotFound = 7,
    BatchAlreadyExecuted = 8,
    InvalidAmount = 9,
    AllocationExceeded = 10,
    EmptyBatch = 11,
    ZeroAddress = 12,
}
