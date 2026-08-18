#![no_std]
use soroban_sdk::{
    contract, contractimpl, token, Address, BytesN, Env, IntoVal, String, Symbol,
};

mod errors;
mod events;
mod storage;
mod types;

#[cfg(test)]
mod test;

pub use errors::Error;
pub use types::{BatchItem, BatchVerificationResult, Campaign, CampaignStatus};

#[contract]
pub struct CampaignContract;

#[contractimpl]
impl CampaignContract {
    /// Initialize contract with admin address and token (Stellar Asset Contract) address.
    pub fn initialize(env: Env, admin: Address, token: Address) -> Result<(), Error> {
        if storage::is_initialized(&env) {
            return Err(Error::AlreadyInitialized);
        }
        admin.require_auth();
        storage::set_admin(&env, &admin);
        storage::set_token(&env, &token);
        storage::set_initialized(&env);
        Ok(())
    }

    /// Create a new charity campaign.
    pub fn create_campaign(
        env: Env,
        owner: Address,
        title: String,
        description: String,
        target_amount: i128,
    ) -> Result<u64, Error> {
        if !storage::is_initialized(&env) {
            return Err(Error::NotInitialized);
        }
        owner.require_auth();

        if target_amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let campaign_id = storage::increment_campaign_count(&env);
        let created_at = env.ledger().timestamp();

        let campaign = Campaign {
            id: campaign_id,
            owner: owner.clone(),
            title,
            description,
            target_amount,
            raised_amount: 0,
            distributed_amount: 0,
            status: CampaignStatus::Draft,
            created_at,
        };

        storage::set_campaign(&env, campaign_id, &campaign);
        events::emit_campaign_created(&env, campaign_id, owner, target_amount);

        Ok(campaign_id)
    }

    /// Activate campaign so it can accept donations and distributions.
    pub fn activate_campaign(env: Env, caller: Address, campaign_id: u64) -> Result<(), Error> {
        caller.require_auth();
        let mut campaign = storage::get_campaign(&env, campaign_id).ok_or(Error::CampaignNotFound)?;

        let admin = storage::get_admin(&env);
        if caller != campaign.owner && caller != admin {
            return Err(Error::Unauthorized);
        }

        if campaign.status != CampaignStatus::Draft && campaign.status != CampaignStatus::Paused {
            return Err(Error::InvalidStateTransition);
        }

        let old_status = campaign.status.clone();
        campaign.status = CampaignStatus::Active;
        storage::set_campaign(&env, campaign_id, &campaign);

        events::emit_status_changed(&env, campaign_id, old_status, CampaignStatus::Active);
        Ok(())
    }

    /// Pause campaign (stops donations and distributions).
    pub fn pause_campaign(env: Env, caller: Address, campaign_id: u64) -> Result<(), Error> {
        caller.require_auth();
        let mut campaign = storage::get_campaign(&env, campaign_id).ok_or(Error::CampaignNotFound)?;

        let admin = storage::get_admin(&env);
        if caller != campaign.owner && caller != admin {
            return Err(Error::Unauthorized);
        }

        if campaign.status != CampaignStatus::Active {
            return Err(Error::InvalidStateTransition);
        }

        let old_status = campaign.status.clone();
        campaign.status = CampaignStatus::Paused;
        storage::set_campaign(&env, campaign_id, &campaign);

        events::emit_status_changed(&env, campaign_id, old_status, CampaignStatus::Paused);
        Ok(())
    }

    /// Mark campaign completed.
    pub fn complete_campaign(env: Env, caller: Address, campaign_id: u64) -> Result<(), Error> {
        caller.require_auth();
        let mut campaign = storage::get_campaign(&env, campaign_id).ok_or(Error::CampaignNotFound)?;

        let admin = storage::get_admin(&env);
        if caller != campaign.owner && caller != admin {
            return Err(Error::Unauthorized);
        }

        if campaign.status != CampaignStatus::Active && campaign.status != CampaignStatus::Paused {
            return Err(Error::InvalidStateTransition);
        }

        let old_status = campaign.status.clone();
        campaign.status = CampaignStatus::Completed;
        storage::set_campaign(&env, campaign_id, &campaign);

        events::emit_status_changed(&env, campaign_id, old_status, CampaignStatus::Completed);
        Ok(())
    }

    /// Cancel campaign.
    pub fn cancel_campaign(env: Env, caller: Address, campaign_id: u64) -> Result<(), Error> {
        caller.require_auth();
        let admin = storage::get_admin(&env);
        if caller != admin {
            return Err(Error::Unauthorized);
        }

        let mut campaign = storage::get_campaign(&env, campaign_id).ok_or(Error::CampaignNotFound)?;
        let old_status = campaign.status.clone();
        campaign.status = CampaignStatus::Cancelled;
        storage::set_campaign(&env, campaign_id, &campaign);

        events::emit_status_changed(&env, campaign_id, old_status, CampaignStatus::Cancelled);
        Ok(())
    }

    /// Donate funds (XLM / Stellar Asset) to active campaign.
    pub fn donate(env: Env, donor: Address, campaign_id: u64, amount: i128) -> Result<(), Error> {
        donor.require_auth();

        if amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        let mut campaign = storage::get_campaign(&env, campaign_id).ok_or(Error::CampaignNotFound)?;
        if campaign.status != CampaignStatus::Active {
            return Err(Error::CampaignNotActive);
        }

        let token_addr = storage::get_token(&env);
        let client = token::Client::new(&env, &token_addr);
        client.transfer(&donor, &env.current_contract_address(), &amount);

        campaign.raised_amount = campaign.raised_amount.checked_add(amount).ok_or(Error::InvalidAmount)?;
        storage::set_campaign(&env, campaign_id, &campaign);

        let prev_donation = storage::get_donation(&env, campaign_id, &donor);
        let new_donation = prev_donation.checked_add(amount).ok_or(Error::InvalidAmount)?;
        storage::set_donation(&env, campaign_id, &donor, new_donation);

        events::emit_donation_received(&env, campaign_id, donor, amount);
        Ok(())
    }

    /// Inter-contract function: Execute a batch distribution via Distribution Contract.
    pub fn execute_batch_distribution(
        env: Env,
        charity: Address,
        distribution_contract: Address,
        campaign_id: u64,
        batch_id: u64,
    ) -> Result<(), Error> {
        charity.require_auth();

        let mut campaign = storage::get_campaign(&env, campaign_id).ok_or(Error::CampaignNotFound)?;

        if charity != campaign.owner {
            return Err(Error::Unauthorized);
        }

        if campaign.status != CampaignStatus::Active {
            return Err(Error::CampaignNotActive);
        }

        let res: BatchVerificationResult = env.invoke_contract(
            &distribution_contract,
            &Symbol::new(&env, "verify_and_lock_batch"),
            (charity.clone(), campaign_id, batch_id).into_val(&env),
        );

        let available_balance = campaign.raised_amount - campaign.distributed_amount;
        if available_balance < res.total_amount {
            return Err(Error::InsufficientFunds);
        }

        let token_addr = storage::get_token(&env);
        let token_client = token::Client::new(&env, &token_addr);

        for item in res.items.iter() {
            token_client.transfer(&env.current_contract_address(), &item.recipient, &item.amount);
        }

        campaign.distributed_amount = campaign
            .distributed_amount
            .checked_add(res.total_amount)
            .ok_or(Error::InvalidAmount)?;
        storage::set_campaign(&env, campaign_id, &campaign);

        let _: () = env.invoke_contract(
            &distribution_contract,
            &Symbol::new(&env, "mark_batch_executed"),
            (charity, campaign_id, batch_id).into_val(&env),
        );

        events::emit_batch_distributed(&env, campaign_id, batch_id, res.total_amount);
        Ok(())
    }

    /// Read campaign details.
    pub fn get_campaign(env: Env, campaign_id: u64) -> Option<Campaign> {
        storage::get_campaign(&env, campaign_id)
    }

    /// Read total campaign count.
    pub fn get_campaign_count(env: Env) -> u64 {
        storage::get_campaign_count(&env)
    }

    /// Read donor's total contribution to a campaign.
    pub fn get_donation(env: Env, campaign_id: u64, donor: Address) -> i128 {
        storage::get_donation(&env, campaign_id, &donor)
    }

    /// Upgrade contract WASM code (Admin only).
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) -> Result<(), Error> {
        let admin = storage::get_admin(&env);
        admin.require_auth();

        env.deployer().update_current_contract_wasm(new_wasm_hash);
        Ok(())
    }
}
