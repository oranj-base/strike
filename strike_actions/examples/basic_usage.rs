use strike_actions::{Market, MarketOption, StrikeActionMetadata};

fn main() {
    // Example 1: Single option market
    let single_option_market = Market {
        id: "bitcoin-100k".to_string(),
        title: "Will Bitcoin reach $100k by end of 2024?".to_string(),
        description: "A prediction market about Bitcoin reaching $100,000 USD".to_string(),
        image: "https://example.com/bitcoin.png".to_string(),
        options: vec![MarketOption {
            option: "Bitcoin reaches $100k".to_string(),
            yes_token_amount: 1000,
            no_token_amount: 500,
            yes_bet_amount: 5000,
            no_bet_amount: 2500,
        }],
    };

    let strike_metadata: StrikeActionMetadata = StrikeActionMetadata::from(single_option_market)
        .with_canister_id("rdmx6-jaaaa-aaaah-qcaiq-cai".to_string())
        .with_label("BetBTC Predictions".to_string());

    println!("Single Option Market Strike Actions:");
    println!("{}", serde_json::to_string_pretty(&strike_metadata).unwrap());
    println!("\n{}\n", "=".repeat(80));

    // Example 2: Multi-option market
    let multi_option_market = Market {
        id: "election-2024".to_string(),
        title: "Who will win the 2024 election?".to_string(),
        description: "Prediction market for the 2024 presidential election".to_string(),
        image: "https://example.com/election.png".to_string(),
        options: vec![
            MarketOption {
                option: "Candidate A".to_string(),
                yes_token_amount: 2000,
                no_token_amount: 1000,
                yes_bet_amount: 10000,
                no_bet_amount: 5000,
            },
            MarketOption {
                option: "Candidate B".to_string(),
                yes_token_amount: 1500,
                no_token_amount: 1200,
                yes_bet_amount: 7500,
                no_bet_amount: 6000,
            },
            MarketOption {
                option: "Other".to_string(),
                yes_token_amount: 500,
                no_token_amount: 300,
                yes_bet_amount: 2500,
                no_bet_amount: 1500,
            },
        ],
    };

    let strike_metadata: StrikeActionMetadata = StrikeActionMetadata::from(multi_option_market)
        .with_canister_id("rdmx6-jaaaa-aaaah-qcaiq-cai".to_string())
        .with_label("Election Predictions".to_string())
        .with_derivation_origin(Some("https://elections.example.com".to_string()));

    println!("Multi-Option Market Strike Actions:");
    println!("{}", serde_json::to_string_pretty(&strike_metadata).unwrap());
}
