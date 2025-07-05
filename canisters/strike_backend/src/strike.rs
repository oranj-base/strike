use candid::{CandidType, Decode, Encode, Principal};
use ic_cdk::caller;
use ic_stable_structures::{storable::Bound, Storable};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

use crate::memory::REGISTRY;
use crate::types::{Paginate, PaginatedResponse, Pagination};

#[derive(Serialize, Deserialize, CandidType, Debug, PartialEq, Clone, Copy)]
#[repr(u8)]
pub enum StrikeStatus {
    Submitted,
    Trusted,
    Blocked,
}

/// Represents a registry entry for a canister in the Strike system
#[derive(Serialize, Deserialize, CandidType, Debug)]
pub struct StrikeRegistry {
    pub canister_id: Principal,
    pub module_hash: Option<String>,
    pub name: String,
    pub email: String,
    pub telegram: Option<String>,
    pub twitter: Option<String>,
    pub project_name: String,
    pub description: String,
    pub website_url: Option<String>,
    pub created_at: u64,
    pub added_by: Principal,
    pub status: StrikeStatus,
}

#[derive(CandidType, Deserialize)]
pub struct AddRegistryParams {
    pub canister_id: Principal,
    pub name: String,
    pub email: String,
    pub telegram: Option<String>,
    pub twitter: Option<String>,
    pub project_name: String,
    pub description: String,
    pub website_url: Option<String>,
}

#[derive(CandidType, Deserialize)]
pub struct UpdateRegistryStatusParams {
    pub canister_id: Principal,
    pub status: StrikeStatus,
}

#[derive(CandidType, Deserialize)]
pub struct GetRegistriesParams {
    pub status: Option<StrikeStatus>,
    pub pagination: Pagination,
}

impl Storable for StrikeRegistry {
    fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Unbounded;
}

pub fn get_strike_by_canister_id(principal: Principal) -> Option<StrikeRegistry> {
    REGISTRY.with(|s| s.borrow().get(&principal))
}

pub fn add_registry(
    canister_id: Principal,
    name: String,
    email: String,
    telegram: Option<String>,
    twitter: Option<String>,
    project_name: String,
    description: String,
    website_url: Option<String>,
) -> Result<(), String> {
    if name.trim().is_empty() {
        return Err("Name cannot be empty".to_string());
    }

    if email.trim().is_empty() {
        return Err("Email cannot be empty".to_string());
    }

    if project_name.trim().is_empty() {
        return Err("Project name cannot be empty".to_string());
    }

    if description.trim().is_empty() {
        return Err("Description cannot be empty".to_string());
    }

    let caller = caller();

    let registry = StrikeRegistry {
        canister_id: canister_id.clone(),
        module_hash: None, // This can be set later if needed
        name,
        email,
        telegram,
        twitter,
        project_name,
        description,
        website_url,
        created_at: ic_cdk::api::time(),
        added_by: caller,
        status: StrikeStatus::Submitted,
    };

    // TODO: Validate canister ownership by caller

    // Find exist one
    if let Some(exist_registry) = REGISTRY.with(|s| s.borrow().get(&canister_id)) {
        if exist_registry.status != StrikeStatus::Submitted {
            return Err("Canister already trusted or blocked".to_string());
        }
    };

    REGISTRY.with(|s| s.borrow_mut().insert(canister_id.clone(), registry));

    Ok(())
}

pub fn update_registry_status(canister_id: Principal, status: StrikeStatus) -> Result<(), String> {
    let mut registry = REGISTRY
        .with(|s| s.borrow_mut().get(&canister_id))
        .ok_or("Canister not found")?;

    registry.status = status;

    REGISTRY.with(|s| s.borrow_mut().insert(canister_id, registry));

    Ok(())
}

pub fn get_registries(params: GetRegistriesParams) -> PaginatedResponse<StrikeRegistry> {
    let mut result: Vec<StrikeRegistry> = Vec::new();

    REGISTRY.with(|s| {
        let registry_ref = s.borrow();
        for (id, _) in registry_ref.iter() {
            // Get each registry with safe handling
            if let Some(registry) = registry_ref.get(&id) {
                if let Some(filter_status) = params.status {
                    if registry.status == filter_status {
                        result.push(registry);
                    }
                } else {
                    result.push(registry);
                }
            }
        }
    });

    let total = result.len() as u32;
    let items = result
        .into_iter()
        .paginate(params.pagination)
        .map(|registry| registry.into())
        .collect();
    PaginatedResponse { total, items }
}
