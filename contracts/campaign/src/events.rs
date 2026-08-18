use soroban_sdk::{symbol_short, Address, Env, Symbol};
use crate::types::CampaignStatus;

pub fn emit_campaign_created(env: &Env, campaign_id: u64, owner: Address, target_amount: i128) {
    let topics = (Symbol::new(env, "campaign"), symbol_short!("created"));
    env.events().publish(topics, (campaign_id, owner, target_amount));
}

pub fn emit_status_changed(env: &Env, campaign_id: u64, old_status: CampaignStatus, new_status: CampaignStatus) {
    let topics = (Symbol::new(env, "campaign"), Symbol::new(env, "status"));
    env.events().publish(topics, (campaign_id, old_status, new_status));
}

pub fn emit_donation_received(env: &Env, campaign_id: u64, donor: Address, amount: i128) {
    let topics = (Symbol::new(env, "campaign"), symbol_short!("donated"));
    env.events().publish(topics, (campaign_id, donor, amount));
}

pub fn emit_batch_distributed(env: &Env, campaign_id: u64, batch_id: u64, total_amount: i128) {
    let topics = (Symbol::new(env, "campaign"), Symbol::new(env, "distrib"));
    env.events().publish(topics, (campaign_id, batch_id, total_amount));
}
