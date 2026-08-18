use soroban_sdk::{contracttype, Address, Env};
use crate::types::{BatchRecord, Beneficiary};

#[contracttype]
pub enum DataKey {
    Admin,
    Initialized,
    BatchCount,
    Beneficiary(u64, Address),
    Batch(u64),
}

const DAY_IN_LEDGERS: u32 = 17280;
const BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS;
const LIFETIME_THRESHOLD: u32 = 7 * DAY_IN_LEDGERS;

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&DataKey::Admin, admin);
    env.storage().instance().extend_ttl(LIFETIME_THRESHOLD, BUMP_AMOUNT);
}

pub fn get_admin(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Admin).unwrap()
}

pub fn is_initialized(env: &Env) -> bool {
    env.storage().instance().get(&DataKey::Initialized).unwrap_or(false)
}

pub fn set_initialized(env: &Env) {
    env.storage().instance().set(&DataKey::Initialized, &true);
    env.storage().instance().extend_ttl(LIFETIME_THRESHOLD, BUMP_AMOUNT);
}

pub fn get_batch_count(env: &Env) -> u64 {
    env.storage().instance().get(&DataKey::BatchCount).unwrap_or(0)
}

pub fn increment_batch_count(env: &Env) -> u64 {
    let count = get_batch_count(env) + 1;
    env.storage().instance().set(&DataKey::BatchCount, &count);
    env.storage().instance().extend_ttl(LIFETIME_THRESHOLD, BUMP_AMOUNT);
    count
}

pub fn set_beneficiary(env: &Env, campaign_id: u64, recipient: &Address, beneficiary: &Beneficiary) {
    let key = DataKey::Beneficiary(campaign_id, recipient.clone());
    env.storage().persistent().set(&key, beneficiary);
    env.storage().persistent().extend_ttl(&key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
}

pub fn get_beneficiary(env: &Env, campaign_id: u64, recipient: &Address) -> Option<Beneficiary> {
    let key = DataKey::Beneficiary(campaign_id, recipient.clone());
    if let Some(b) = env.storage().persistent().get(&key) {
        env.storage().persistent().extend_ttl(&key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
        Some(b)
    } else {
        None
    }
}

pub fn set_batch(env: &Env, batch_id: u64, batch: &BatchRecord) {
    let key = DataKey::Batch(batch_id);
    env.storage().persistent().set(&key, batch);
    env.storage().persistent().extend_ttl(&key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
}

pub fn get_batch(env: &Env, batch_id: u64) -> Option<BatchRecord> {
    let key = DataKey::Batch(batch_id);
    if let Some(b) = env.storage().persistent().get(&key) {
        env.storage().persistent().extend_ttl(&key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
        Some(b)
    } else {
        None
    }
}
