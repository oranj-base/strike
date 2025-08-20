# Strike Actions Library

A Rust library for generating Strike Action metadata for blockchain interactions, specifically designed for prediction markets and betting platforms.

## Features

- Generate Strike Action metadata from market data
- Support for single and multi-option markets
- Configurable canister IDs and derivation origins
- Full serde support for JSON serialization/deserialization
- Candid type system integration

## Installation

Add this to your `Cargo.toml`:

```toml
[dependencies]
strike-actions = "0.1.0"
```

## Usage

```rust
use strike_actions::{Market, MarketOption, StrikeActionMetadata};

// Create a market with options
let market = Market {
    id: "market1".to_string(),
    title: "Will Bitcoin reach $100k by 2024?".to_string(),
    description: "A prediction market about Bitcoin price".to_string(),
    image: "bitcoin-image.png".to_string(),
    options: vec![
        MarketOption {
            option: "Yes".to_string(),
            yes_token_amount: 1000,
            no_token_amount: 500,
            yes_bet_amount: 5000,
            no_bet_amount: 2500,
        }
    ],
};

// Convert to Strike Action metadata
let strike_metadata: StrikeActionMetadata = market.into();

// Customize with your canister ID
let strike_metadata = strike_metadata
    .with_canister_id("your-canister-id".to_string())
    .with_label("My Betting Platform".to_string());

// Serialize to JSON
let json = serde_json::to_string(&strike_metadata).unwrap();
println!("{}", json);
```

## Types

### Market
Represents a prediction market with multiple options.

### StrikeActionMetadata
The main metadata structure that contains all information needed for Strike Actions.

### StrikeAction
Individual actions that users can perform (betting Yes/No on options).

### CandidType
Wrapper around Candid's TypeInner for proper serialization.

## Testing

Run the tests with:

```bash
cargo test
```

## License

MIT License
