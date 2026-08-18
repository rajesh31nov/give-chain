#![cfg(test)]
use super::*;
use soroban_sdk::{
    testutils::Address as _,
    token, Address, Env, String,
};

fn create_token_contract<'a>(env: &Env, admin: &Address) -> token::StellarAssetClient<'a> {
    let token_address = env.register_stellar_asset_contract_v2(admin.clone()).address();
    token::StellarAssetClient::new(env, &token_address)
}

#[test]
fn test_campaign_creation_and_activation() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let charity = Address::generate(&env);
    let token_client = create_token_contract(&env, &admin);

    let campaign_contract_id = env.register(CampaignContract, ());
    let client = CampaignContractClient::new(&env, &campaign_contract_id);

    client.initialize(&admin, &token_client.address);

    let title = String::from_str(&env, "Flood Relief 2026");
    let desc = String::from_str(&env, "Emergency food and supplies for flood victims");
    let target = 5_000_0000000; // 5000 XLM

    let campaign_id = client.create_campaign(&charity, &title, &desc, &target);
    assert_eq!(campaign_id, 1);

    let campaign = client.get_campaign(&campaign_id).unwrap();
    assert_eq!(campaign.status, CampaignStatus::Draft);
    assert_eq!(campaign.target_amount, target);
    assert_eq!(campaign.raised_amount, 0);

    // Activate campaign
    client.activate_campaign(&charity, &campaign_id);
    let campaign_active = client.get_campaign(&campaign_id).unwrap();
    assert_eq!(campaign_active.status, CampaignStatus::Active);

    // Pause campaign
    client.pause_campaign(&charity, &campaign_id);
    let campaign_paused = client.get_campaign(&campaign_id).unwrap();
    assert_eq!(campaign_paused.status, CampaignStatus::Paused);
}

#[test]
fn test_donation_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let charity = Address::generate(&env);
    let donor = Address::generate(&env);

    let token_client = create_token_contract(&env, &admin);
    let token_admin_client = token::Client::new(&env, &token_client.address);

    let campaign_contract_id = env.register(CampaignContract, ());
    let client = CampaignContractClient::new(&env, &campaign_contract_id);

    client.initialize(&admin, &token_client.address);

    // Mint 1000 XLM to donor
    let initial_balance = 1_000_0000000;
    token_client.mint(&donor, &initial_balance);
    assert_eq!(token_admin_client.balance(&donor), initial_balance);

    // Create & activate campaign
    let title = String::from_str(&env, "Medical Aid Fund");
    let desc = String::from_str(&env, "Medical supplies");
    let target = 3_000_0000000;
    let campaign_id = client.create_campaign(&charity, &title, &desc, &target);
    client.activate_campaign(&charity, &campaign_id);

    // Donor donates 500 XLM
    let donation_amount = 500_0000000;
    client.donate(&donor, &campaign_id, &donation_amount);

    // Check balances and accounting
    assert_eq!(token_admin_client.balance(&donor), 500_0000000);
    assert_eq!(token_admin_client.balance(&campaign_contract_id), 500_0000000);

    let campaign = client.get_campaign(&campaign_id).unwrap();
    assert_eq!(campaign.raised_amount, donation_amount);
    assert_eq!(client.get_donation(&campaign_id, &donor), donation_amount);
}

#[test]
#[should_panic]
fn test_cannot_donate_to_draft_campaign() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let charity = Address::generate(&env);
    let donor = Address::generate(&env);
    let token_client = create_token_contract(&env, &admin);

    let campaign_contract_id = env.register(CampaignContract, ());
    let client = CampaignContractClient::new(&env, &campaign_contract_id);

    client.initialize(&admin, &token_client.address);
    token_client.mint(&donor, &1_000_0000000);

    let campaign_id = client.create_campaign(
        &charity,
        &String::from_str(&env, "Education Support"),
        &String::from_str(&env, "Supplies"),
        &2_500_0000000,
    );

    // Donating to a Draft campaign should fail / panic
    client.donate(&donor, &campaign_id, &500_0000000);
}
