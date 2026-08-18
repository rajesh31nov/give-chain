#![no_std]
use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, Vec};

mod errors;
mod events;
mod storage;
mod types;

#[cfg(test)]
mod test;

pub use errors::Error;
pub use types::{BatchItem, BatchRecord, BatchVerificationResult, Beneficiary};

#[contract]
pub struct DistributionContract;

#[contractimpl]
impl DistributionContract {
    /// Initialize distribution contract with admin address.
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        if storage::is_initialized(&env) {
            return Err(Error::AlreadyInitialized);
        }
        admin.require_auth();
        storage::set_admin(&env, &admin);
        storage::set_initialized(&env);
        Ok(())
    }

    /// Register a new beneficiary for a campaign.
    pub fn register_beneficiary(
        env: Env,
        charity: Address,
        campaign_id: u64,
        recipient: Address,
        allocated_amount: i128,
    ) -> Result<(), Error> {
        if !storage::is_initialized(&env) {
            return Err(Error::NotInitialized);
        }
        charity.require_auth();

        if allocated_amount <= 0 {
            return Err(Error::InvalidAmount);
        }

        if storage::get_beneficiary(&env, campaign_id, &recipient).is_some() {
            return Err(Error::BeneficiaryAlreadyApproved);
        }

        let beneficiary = Beneficiary {
            campaign_id,
            recipient: recipient.clone(),
            allocated_amount,
            received_amount: 0,
            is_approved: false,
        };

        storage::set_beneficiary(&env, campaign_id, &recipient, &beneficiary);
        events::emit_beneficiary_registered(&env, campaign_id, recipient, allocated_amount);
        Ok(())
    }

    /// Approve registered beneficiary.
    pub fn approve_beneficiary(
        env: Env,
        caller: Address,
        campaign_id: u64,
        recipient: Address,
    ) -> Result<(), Error> {
        caller.require_auth();
        let mut beneficiary = storage::get_beneficiary(&env, campaign_id, &recipient)
            .ok_or(Error::BeneficiaryNotFound)?;

        beneficiary.is_approved = true;
        storage::set_beneficiary(&env, campaign_id, &recipient, &beneficiary);
        events::emit_beneficiary_approved(&env, campaign_id, recipient);
        Ok(())
    }

    /// Create a distribution batch for approved beneficiaries.
    pub fn create_distribution_batch(
        env: Env,
        charity: Address,
        campaign_id: u64,
        items: Vec<BatchItem>,
    ) -> Result<u64, Error> {
        charity.require_auth();

        if items.is_empty() {
            return Err(Error::EmptyBatch);
        }

        let mut total_amount: i128 = 0;

        for item in items.iter() {
            if item.amount <= 0 {
                return Err(Error::InvalidAmount);
            }

            let b = storage::get_beneficiary(&env, campaign_id, &item.recipient)
                .ok_or(Error::BeneficiaryNotFound)?;

            if !b.is_approved {
                return Err(Error::BeneficiaryNotApproved);
            }

            let remaining_allocation = b.allocated_amount - b.received_amount;
            if item.amount > remaining_allocation {
                return Err(Error::AllocationExceeded);
            }

            total_amount = total_amount
                .checked_add(item.amount)
                .ok_or(Error::InvalidAmount)?;
        }

        let batch_id = storage::increment_batch_count(&env);
        let created_at = env.ledger().timestamp();

        let batch = BatchRecord {
            batch_id,
            campaign_id,
            items,
            total_amount,
            executed: false,
            created_at,
        };

        storage::set_batch(&env, batch_id, &batch);
        events::emit_batch_created(&env, campaign_id, batch_id, total_amount);

        Ok(batch_id)
    }

    /// Inter-Contract function: Verify batch details and ensure it hasn't been executed.
    pub fn verify_and_lock_batch(
        env: Env,
        caller: Address,
        campaign_id: u64,
        batch_id: u64,
    ) -> Result<BatchVerificationResult, Error> {
        caller.require_auth();

        let batch = storage::get_batch(&env, batch_id).ok_or(Error::BatchNotFound)?;

        if batch.campaign_id != campaign_id {
            return Err(Error::Unauthorized);
        }

        if batch.executed {
            return Err(Error::BatchAlreadyExecuted);
        }

        Ok(BatchVerificationResult {
            batch_id,
            campaign_id,
            items: batch.items,
            total_amount: batch.total_amount,
        })
    }

    /// Inter-Contract callback: Mark batch executed and update beneficiary received amounts.
    pub fn mark_batch_executed(
        env: Env,
        caller: Address,
        campaign_id: u64,
        batch_id: u64,
    ) -> Result<(), Error> {
        caller.require_auth();

        let mut batch = storage::get_batch(&env, batch_id).ok_or(Error::BatchNotFound)?;

        if batch.campaign_id != campaign_id {
            return Err(Error::Unauthorized);
        }

        if batch.executed {
            return Err(Error::BatchAlreadyExecuted);
        }

        for item in batch.items.iter() {
            if let Some(mut b) = storage::get_beneficiary(&env, campaign_id, &item.recipient) {
                b.received_amount = b
                    .received_amount
                    .checked_add(item.amount)
                    .ok_or(Error::InvalidAmount)?;
                storage::set_beneficiary(&env, campaign_id, &item.recipient, &b);
            }
        }

        batch.executed = true;
        storage::set_batch(&env, batch_id, &batch);

        events::emit_batch_executed(&env, campaign_id, batch_id);
        Ok(())
    }

    /// Read beneficiary record.
    pub fn get_beneficiary(env: Env, campaign_id: u64, recipient: Address) -> Option<Beneficiary> {
        storage::get_beneficiary(&env, campaign_id, &recipient)
    }

    /// Read distribution batch record.
    pub fn get_batch(env: Env, batch_id: u64) -> Option<BatchRecord> {
        storage::get_batch(&env, batch_id)
    }

    /// Read total batch count.
    pub fn get_batch_count(env: Env) -> u64 {
        storage::get_batch_count(&env)
    }

    /// Upgrade contract WASM code (Admin only).
    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) -> Result<(), Error> {
        let admin = storage::get_admin(&env);
        admin.require_auth();

        env.deployer().update_current_contract_wasm(new_wasm_hash);
        Ok(())
    }
}
