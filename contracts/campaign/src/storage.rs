use soroban_sdk::{contracttype, Address, Env};
use crate::types::Campaign;

#[contracttype]
pub enum DataKey {
    Admin,
    Token,
    Initialized,
    CampaignCount,
    Campaign(u64),
    Donation(u64, Address),
}

const DAY_IN_LEDGERS: u32 = 17280; // ~5 sec per ledger
const BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS; // 30 days
const LIFETIME_THRESHOLD: u32 = 7 * DAY_IN_LEDGERS; // 7 days

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&DataKey::Admin, admin);
    env.storage().instance().extend_ttl(LIFETIME_THRESHOLD, BUMP_AMOUNT);
}

pub fn get_admin(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Admin).unwrap()
}

pub fn set_token(env: &Env, token: &Address) {
    env.storage().instance().set(&DataKey::Token, token);
    env.storage().instance().extend_ttl(LIFETIME_THRESHOLD, BUMP_AMOUNT);
}

pub fn get_token(env: &Env) -> Address {
    env.storage().instance().get(&DataKey::Token).unwrap()
}

pub fn is_initialized(env: &Env) -> bool {
    env.storage().instance().get(&DataKey::Initialized).unwrap_or(false)
}

pub fn set_initialized(env: &Env) {
    env.storage().instance().set(&DataKey::Initialized, &true);
    env.storage().instance().extend_ttl(LIFETIME_THRESHOLD, BUMP_AMOUNT);
}

pub fn get_campaign_count(env: &Env) -> u64 {
    env.storage().instance().get(&DataKey::CampaignCount).unwrap_or(0)
}

pub fn increment_campaign_count(env: &Env) -> u64 {
    let count = get_campaign_count(env) + 1;
    env.storage().instance().set(&DataKey::CampaignCount, &count);
    env.storage().instance().extend_ttl(LIFETIME_THRESHOLD, BUMP_AMOUNT);
    count
}

pub fn set_campaign(env: &Env, id: u64, campaign: &Campaign) {
    let key = DataKey::Campaign(id);
    env.storage().persistent().set(&key, campaign);
    env.storage().persistent().extend_ttl(&key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
}

pub fn get_campaign(env: &Env, id: u64) -> Option<Campaign> {
    let key = DataKey::Campaign(id);
    if let Some(c) = env.storage().persistent().get(&key) {
        env.storage().persistent().extend_ttl(&key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
        Some(c)
    } else {
        None
    }
}

pub fn set_donation(env: &Env, campaign_id: u64, donor: &Address, amount: i128) {
    let key = DataKey::Donation(campaign_id, donor.clone());
    env.storage().persistent().set(&key, &amount);
    env.storage().persistent().extend_ttl(&key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
}

pub fn get_donation(env: &Env, campaign_id: u64, donor: &Address) -> i128 {
    let key = DataKey::Donation(campaign_id, donor.clone());
    if let Some(amt) = env.storage().persistent().get(&key) {
        env.storage().persistent().extend_ttl(&key, LIFETIME_THRESHOLD, BUMP_AMOUNT);
        amt
    } else {
        0
    }
}
