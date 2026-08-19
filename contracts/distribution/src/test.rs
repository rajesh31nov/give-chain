#![cfg(test)]
use super::*;
use givechain_campaign::{CampaignContract, CampaignContractClient};
use soroban_sdk::{
    testutils::Address as _,
    token, Address, Env, String, Vec,
};

fn create_token_contract<'a>(env: &Env, admin: &Address) -> token::StellarAssetClient<'a> {
    let token_address = env.register_stellar_asset_contract_v2(admin.clone()).address();
    token::StellarAssetClient::new(env, &token_address)
}

#[test]
fn test_beneficiary_registration_and_approval() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let charity = Address::generate(&env);
    let recipient = Address::generate(&env);

    let contract_id = env.register(DistributionContract, ());
    let client = DistributionContractClient::new(&env, &contract_id);

    client.initialize(&admin);

    let campaign_id = 1u64;
    let allocated_amount = 500_0000000;

    client.register_beneficiary(&charity, &campaign_id, &recipient, &allocated_amount);

    let ben_before = client.get_beneficiary(&campaign_id, &recipient).unwrap();
    assert_eq!(ben_before.is_approved, false);
    assert_eq!(ben_before.allocated_amount, allocated_amount);
    assert_eq!(ben_before.received_amount, 0);

    client.approve_beneficiary(&admin, &campaign_id, &recipient);

    let ben_after = client.get_beneficiary(&campaign_id, &recipient).unwrap();
    assert_eq!(ben_after.is_approved, true);
}

#[test]
fn test_create_distribution_batch() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let charity = Address::generate(&env);
    let recipient_a = Address::generate(&env);
    let recipient_b = Address::generate(&env);

    let contract_id = env.register(DistributionContract, ());
    let client = DistributionContractClient::new(&env, &contract_id);

    client.initialize(&admin);

    let campaign_id = 1u64;

    client.register_beneficiary(&charity, &campaign_id, &recipient_a, &500_0000000);
    client.register_beneficiary(&charity, &campaign_id, &recipient_b, &300_0000000);

    client.approve_beneficiary(&admin, &campaign_id, &recipient_a);
    client.approve_beneficiary(&admin, &campaign_id, &recipient_b);

    let mut items = Vec::new(&env);
    items.push_back(BatchItem {
        recipient: recipient_a.clone(),
        amount: 200_0000000,
    });
    items.push_back(BatchItem {
        recipient: recipient_b.clone(),
        amount: 100_0000000,
    });

    let batch_id = client.create_distribution_batch(&charity, &campaign_id, &items);
    assert_eq!(batch_id, 1);

    let batch = client.get_batch(&batch_id).unwrap();
    assert_eq!(batch.total_amount, 300_0000000);
    assert_eq!(batch.executed, false);
}

#[test]
#[should_panic]
fn test_double_distribution_prevention_exceeds_allocation() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let charity = Address::generate(&env);
    let recipient = Address::generate(&env);

    let contract_id = env.register(DistributionContract, ());
    let client = DistributionContractClient::new(&env, &contract_id);

    client.initialize(&admin);

    let campaign_id = 1u64;
    client.register_beneficiary(&charity, &campaign_id, &recipient, &100_0000000);
    client.approve_beneficiary(&admin, &campaign_id, &recipient);

    let mut items = Vec::new(&env);
    // Requesting 150 XLM when limit is 100 XLM should panic
    items.push_back(BatchItem {
        recipient: recipient.clone(),
        amount: 150_0000000,
    });

    client.create_distribution_batch(&charity, &campaign_id, &items);
}

#[test]
#[should_panic]
fn test_unapproved_beneficiary_batch_rejection() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let charity = Address::generate(&env);
    let recipient = Address::generate(&env);

    let contract_id = env.register(DistributionContract, ());
    let client = DistributionContractClient::new(&env, &contract_id);

    client.initialize(&admin);

    let campaign_id = 1u64;
    client.register_beneficiary(&charity, &campaign_id, &recipient, &500_0000000);
    // Notice: NOT approving recipient

    let mut items = Vec::new(&env);
    items.push_back(BatchItem {
        recipient: recipient.clone(),
        amount: 200_0000000,
    });

    // Creating batch for unapproved beneficiary should panic
    client.create_distribution_batch(&charity, &campaign_id, &items);
}

#[test]
fn test_full_inter_contract_donation_to_distribution_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let charity = Address::generate(&env);
    let donor = Address::generate(&env);
    let beneficiary_a = Address::generate(&env);
    let beneficiary_b = Address::generate(&env);

    let token_client = create_token_contract(&env, &admin);
    let token_admin_client = token::Client::new(&env, &token_client.address);

    // Register both contracts
    let campaign_contract_id = env.register(CampaignContract, ());
    let campaign_client = CampaignContractClient::new(&env, &campaign_contract_id);

    let distribution_contract_id = env.register(DistributionContract, ());
    let distribution_client = DistributionContractClient::new(&env, &distribution_contract_id);

    // Initialize both contracts
    campaign_client.initialize(&admin, &token_client.address);
    distribution_client.initialize(&admin);

    // Mint 2000 XLM to Donor
    token_client.mint(&donor, &2_000_0000000);

    // Charity creates & activates campaign
    let campaign_id = campaign_client.create_campaign(
        &charity,
        &String::from_str(&env, "Flood Relief 2026"),
        &String::from_str(&env, "Emergency Aid"),
        &5_000_0000000,
    );
    campaign_client.activate_campaign(&charity, &campaign_id);

    // Donor donates 1500 XLM
    campaign_client.donate(&donor, &campaign_id, &1_500_0000000);
    assert_eq!(token_admin_client.balance(&campaign_contract_id), 1_500_0000000);

    // Register and approve beneficiaries
    distribution_client.register_beneficiary(&charity, &campaign_id, &beneficiary_a, &600_0000000);
    distribution_client.register_beneficiary(&charity, &campaign_id, &beneficiary_b, &400_0000000);

    distribution_client.approve_beneficiary(&admin, &campaign_id, &beneficiary_a);
    distribution_client.approve_beneficiary(&admin, &campaign_id, &beneficiary_b);

    // Create distribution batch
    let mut items = Vec::new(&env);
    items.push_back(BatchItem {
        recipient: beneficiary_a.clone(),
        amount: 500_0000000,
    });
    items.push_back(BatchItem {
        recipient: beneficiary_b.clone(),
        amount: 300_0000000,
    });

    let batch_id = distribution_client.create_distribution_batch(&charity, &campaign_id, &items);

    // Perform REAL contract-to-contract call:
    // Campaign contract calls Distribution contract to verify, transfer tokens via SAC, and mark executed.
    campaign_client.execute_batch_distribution(
        &charity,
        &distribution_contract_id,
        &campaign_id,
        &batch_id,
    );

    // Verify token balances
    assert_eq!(token_admin_client.balance(&beneficiary_a), 500_0000000);
    assert_eq!(token_admin_client.balance(&beneficiary_b), 300_0000000);
    assert_eq!(token_admin_client.balance(&campaign_contract_id), 700_0000000);

    // Verify campaign accounting
    let updated_campaign = campaign_client.get_campaign(&campaign_id).unwrap();
    assert_eq!(updated_campaign.raised_amount, 1_500_0000000);
    assert_eq!(updated_campaign.distributed_amount, 800_0000000);

    // Verify beneficiary records on distribution contract
    let ben_a = distribution_client.get_beneficiary(&campaign_id, &beneficiary_a).unwrap();
    let ben_b = distribution_client.get_beneficiary(&campaign_id, &beneficiary_b).unwrap();
    assert_eq!(ben_a.received_amount, 500_0000000);
    assert_eq!(ben_b.received_amount, 300_0000000);

    // Verify batch is executed
    let batch = distribution_client.get_batch(&batch_id).unwrap();
    assert_eq!(batch.executed, true);
}
