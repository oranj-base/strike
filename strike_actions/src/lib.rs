use std::fmt::Display;

use candid::types::TypeInner;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "lowercase")]
pub enum ActionType {
    Query,
    Update,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct UIParameter {
    pub name: String,
    pub label: String,
    pub candid_type: CandidType,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct StrikeAction {
    pub label: String,
    pub method: String,
    #[serde(rename = "type")]
    pub action_type: ActionType,
    pub ui_parameters: Vec<UIParameter>,
    pub input: Vec<CandidType>,
    pub input_parameters: Vec<Value>,
    pub output: Vec<CandidType>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct StrikeActionMetadata {
    pub icon: String,
    pub homepage: String,
    pub label: String,
    pub title: String,
    pub description: String,
    pub canister_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub derivation_origin: Option<String>,
    pub actions: Vec<StrikeAction>,
}

#[derive(Debug, PartialEq, Hash, Eq, Clone, PartialOrd, Ord)]
pub struct CandidType(TypeInner);

impl From<TypeInner> for CandidType {
    fn from(value: TypeInner) -> Self {
        CandidType(value)
    }
}

impl Display for CandidType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let output = match &self.0 {
            TypeInner::Null => "Null".to_string(),
            TypeInner::Bool => "Bool".to_string(),
            TypeInner::Nat => "Nat".to_string(),
            TypeInner::Int => "Int".to_string(),
            TypeInner::Nat8 => "Nat8".to_string(),
            TypeInner::Nat16 => "Nat16".to_string(),
            TypeInner::Nat32 => "Nat32".to_string(),
            TypeInner::Nat64 => "Nat64".to_string(),
            TypeInner::Int8 => "Int8".to_string(),
            TypeInner::Int16 => "Int16".to_string(),
            TypeInner::Int32 => "Int32".to_string(),
            TypeInner::Int64 => "Int64".to_string(),
            TypeInner::Float32 => "Float32".to_string(),
            TypeInner::Float64 => "Float64".to_string(),
            TypeInner::Text => "Text".to_string(),
            TypeInner::Reserved => "Reserved".to_string(),
            TypeInner::Empty => "Empty".to_string(),
            TypeInner::Knot(_) => "Knot".to_string(),
            TypeInner::Var(_) => "Var".to_string(),
            TypeInner::Unknown => "Unknown".to_string(),
            TypeInner::Opt(_) => "Opt".to_string(),
            TypeInner::Vec(_) => "Vec".to_string(),
            TypeInner::Record(_) => "Record".to_string(),
            TypeInner::Variant(_) => "Variant".to_string(),
            TypeInner::Func(_) => "Func".to_string(),
            TypeInner::Service(_) => "Service".to_string(),
            TypeInner::Class(_, _) => "Class".to_string(),
            TypeInner::Principal => "Principal".to_string(),
            TypeInner::Future => "Future".to_string(),
        };
        write!(f, "{}", output)
    }
}

impl Serialize for CandidType {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        self.to_string().serialize(serializer)
    }
}

impl<'de> Deserialize<'de> for CandidType {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        let type_inner = match s.as_str() {
            "Null" => TypeInner::Null,
            "Bool" => TypeInner::Bool,
            "Nat" => TypeInner::Nat,
            "Int" => TypeInner::Int,
            "Nat8" => TypeInner::Nat8,
            "Nat16" => TypeInner::Nat16,
            "Nat32" => TypeInner::Nat32,
            "Nat64" => TypeInner::Nat64,
            "Int8" => TypeInner::Int8,
            "Int16" => TypeInner::Int16,
            "Int32" => TypeInner::Int32,
            "Int64" => TypeInner::Int64,
            "Float32" => TypeInner::Float32,
            "Float64" => TypeInner::Float64,
            "Text" => TypeInner::Text,
            "Reserved" => TypeInner::Reserved,
            "Empty" => TypeInner::Empty,
            "Principal" => TypeInner::Principal,
            "Future" => TypeInner::Future,
            _ => return Err(serde::de::Error::custom(format!("Unknown CandidType: {}", s))),
        };
        Ok(CandidType(type_inner))
    }
}

// Simplified market types for the library
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketOption {
    pub option: String,
    pub yes_token_amount: u128,
    pub no_token_amount: u128,
    pub yes_bet_amount: u128,
    pub no_bet_amount: u128,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Market {
    pub id: String,
    pub title: String,
    pub description: String,
    pub image: String,
    pub options: Vec<MarketOption>,
}

impl From<Market> for StrikeActionMetadata {
    fn from(value: Market) -> Self {
        let actions = if value.options.len() == 1 {
            let option = value.options.first().unwrap();

            vec![
                StrikeAction {
                    label: format!("Bet Yes on {}", option.option.clone()),
                    method: "bet".to_string(),
                    action_type: ActionType::Update,
                    ui_parameters: vec![UIParameter {
                        name: "bet_amount".to_string(),
                        label: "Bet amount".to_string(),
                        candid_type: CandidType::from(TypeInner::Nat),
                    }],
                    input: vec![
                        CandidType::from(TypeInner::Text),
                        CandidType::from(TypeInner::Nat32),
                        CandidType::from(TypeInner::Text),
                        CandidType::from(TypeInner::Nat),
                    ],
                    input_parameters: vec![json!(value.id.clone()), json!(1), json!("Yes"), json!("{bet_amount}")],
                    output: vec![CandidType::from(TypeInner::Text)],
                },
                StrikeAction {
                    label: format!("Bet No on {}", option.option.clone()),
                    method: "bet".to_string(),
                    action_type: ActionType::Update,
                    ui_parameters: vec![UIParameter {
                        name: "bet_amount".to_string(),
                        label: "Bet amount".to_string(),
                        candid_type: CandidType::from(TypeInner::Nat),
                    }],
                    input: vec![
                        CandidType::from(TypeInner::Text),
                        CandidType::from(TypeInner::Nat32),
                        CandidType::from(TypeInner::Text),
                        CandidType::from(TypeInner::Nat),
                    ],
                    input_parameters: vec![json!(value.id.clone()), json!(1), json!("No"), json!("{bet_amount}")],
                    output: vec![CandidType::from(TypeInner::Text)],
                },
            ]
        } else {
            value
                .options
                .into_iter()
                .enumerate()
                .fold(vec![], |mut acc, (option_id, option)| {
                    acc.push(StrikeAction {
                        label: format!("Bet Yes on {}", option.option.clone()),
                        method: "bet".to_string(),
                        action_type: ActionType::Update,
                        ui_parameters: vec![UIParameter {
                            name: "bet_amount".to_string(),
                            label: "Bet amount".to_string(),
                            candid_type: CandidType::from(TypeInner::Nat),
                        }],
                        input: vec![
                            CandidType::from(TypeInner::Text),
                            CandidType::from(TypeInner::Nat32),
                            CandidType::from(TypeInner::Text),
                            CandidType::from(TypeInner::Nat),
                        ],
                        input_parameters: vec![json!(value.id.clone()), json!(option_id), json!("Yes"), json!("{bet_amount}")],
                        output: vec![CandidType::from(TypeInner::Text)],
                    });
                    acc.push(StrikeAction {
                        label: format!("Bet No on {}", option.option.clone()),
                        method: "bet".to_string(),
                        action_type: ActionType::Update,
                        ui_parameters: vec![UIParameter {
                            name: "bet_amount".to_string(),
                            label: "Bet amount".to_string(),
                            candid_type: CandidType::from(TypeInner::Nat),
                        }],
                        input: vec![
                            CandidType::from(TypeInner::Text),
                            CandidType::from(TypeInner::Nat32),
                            CandidType::from(TypeInner::Text),
                            CandidType::from(TypeInner::Nat),
                        ],
                        input_parameters: vec![json!(value.id.clone()), json!(option_id), json!("No"), json!("{bet_amount}")],
                        output: vec![CandidType::from(TypeInner::Text)],
                    });

                    acc
                })
        };

        StrikeActionMetadata {
            homepage: format!("https://betbtc.win/market/{}", value.id),
            icon: value.image,
            label: "betBTC".to_string(),
            title: value.title,
            description: value.description,
            canister_id: "default-canister-id".to_string(), // Default canister ID
            derivation_origin: Some("https://xthyg-wyaaa-aaaak-ao2fa-cai.icp0.io".to_string()),
            actions,
        }
    }
}

impl StrikeActionMetadata {
    /// Create StrikeActionMetadata with a custom canister ID
    pub fn with_canister_id(mut self, canister_id: String) -> Self {
        self.canister_id = canister_id;
        self
    }

    /// Create StrikeActionMetadata with a custom derivation origin
    pub fn with_derivation_origin(mut self, derivation_origin: Option<String>) -> Self {
        self.derivation_origin = derivation_origin;
        self
    }

    /// Create StrikeActionMetadata with a custom label
    pub fn with_label(mut self, label: String) -> Self {
        self.label = label;
        self
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_into_strike_action_metadata() {
        let market = Market {
            id: "market1".to_string(),
            title: "Test Market".to_string(),
            description: "A test market".to_string(),
            image: "test-image.png".to_string(),
            options: vec![
                MarketOption {
                    option: "Option 1".to_string(),
                    yes_token_amount: 0,
                    no_token_amount: 0,
                    yes_bet_amount: 0,
                    no_bet_amount: 0,
                },
                MarketOption {
                    option: "Option 2".to_string(),
                    yes_token_amount: 0,
                    no_token_amount: 0,
                    yes_bet_amount: 0,
                    no_bet_amount: 0,
                },
            ],
        };

        let strike_action_metadata: StrikeActionMetadata = market.clone().into();

        let strike_json = serde_json::to_string(&strike_action_metadata).unwrap();

        assert!(strike_json.contains("Bet Yes on Option 1"));
        assert!(strike_json.contains("Bet No on Option 1"));
        assert!(strike_json.contains("Bet Yes on Option 2"));
        assert!(strike_json.contains("Bet No on Option 2"));
        assert!(strike_json.contains("betBTC"));
        assert!(strike_json.contains("Test Market"));
    }

    #[test]
    fn test_candid_type_serialization() {
        let candid_type = CandidType::from(TypeInner::Nat);
        let serialized = serde_json::to_string(&candid_type).unwrap();
        assert_eq!(serialized, "\"Nat\"");
    }

    #[test]
    fn test_candid_type_deserialization() {
        let json = "\"Nat\"";
        let candid_type: CandidType = serde_json::from_str(json).unwrap();
        assert_eq!(candid_type.to_string(), "Nat");
    }

    #[test]
    fn test_with_canister_id() {
        let market = Market {
            id: "market1".to_string(),
            title: "Test Market".to_string(),
            description: "A test market".to_string(),
            image: "test-image.png".to_string(),
            options: vec![MarketOption {
                option: "Option 1".to_string(),
                yes_token_amount: 0,
                no_token_amount: 0,
                yes_bet_amount: 0,
                no_bet_amount: 0,
            }],
        };

        let strike_action_metadata: StrikeActionMetadata =
            StrikeActionMetadata::from(market).with_canister_id("custom-canister-id".to_string());

        assert_eq!(strike_action_metadata.canister_id, "custom-canister-id");
    }
}
