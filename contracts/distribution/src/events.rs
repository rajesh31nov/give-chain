use soroban_sdk::{symbol_short, Address, Env, Symbol};

pub fn emit_beneficiary_registered(env: &Env, campaign_id: u64, recipient: Address, allocated_amount: i128) {
    let topics = (Symbol::new(env, "beneficiary"), symbol_short!("reg"));
    env.events().publish(topics, (campaign_id, recipient, allocated_amount));
}

pub fn emit_beneficiary_approved(env: &Env, campaign_id: u64, recipient: Address) {
    let topics = (Symbol::new(env, "beneficiary"), Symbol::new(env, "approved"));
    env.events().publish(topics, (campaign_id, recipient));
}

pub fn emit_batch_created(env: &Env, campaign_id: u64, batch_id: u64, total_amount: i128) {
    let topics = (Symbol::new(env, "batch"), symbol_short!("created"));
    env.events().publish(topics, (campaign_id, batch_id, total_amount));
}

pub fn emit_batch_executed(env: &Env, campaign_id: u64, batch_id: u64) {
    let topics = (Symbol::new(env, "batch"), Symbol::new(env, "executed"));
    env.events().publish(topics, (campaign_id, batch_id));
}
