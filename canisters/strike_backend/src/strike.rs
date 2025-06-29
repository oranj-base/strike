mod admins;
mod guards;
mod lifecycle;
mod memory;
mod serializer;
#[cfg(test)]
mod test;

use candid::{CandidType, Decode, Encode, Principal};
use ic_cdk::{caller, query, update};
use ic_stable_structures::{storable::Bound, Storable};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

use crate::guards::*;
use crate::memory::REGISTRY;

#[derive(Serialize, Deserialize, CandidType, Debug, PartialEq, Clone, Copy)]
#[repr(u8)]
enum StrikeStatus {
    Submitted,
    Trusted,
    Blocked,
}

/// Represents a registry entry for a canister in the Strike system
#[derive(Serialize, Deserialize, CandidType, Debug)]
struct StrikeRegistry {
    /// Unique identifier of the canister
    canister_id: Principal,
    /// Optional hash of the canister's module
    module_hash: Option<String>,
    /// Name of the developer or organization
    name: String,
    /// Contact email
    email: String,
    /// Optional Telegram contact
    telegram: Option<String>,
    /// Optional Twitter handle
    twitter: Option<String>,
    /// Name of the project
    project_name: String,
    /// Description of the project/canister
    description: String,
    /// Optional website URL
    website_url: Option<String>,
    /// Timestamp when this registry was created
    created_at: u64,
    /// Principal who added this registry
    added_by: Principal,
    /// Current status of this registry
    status: StrikeStatus,
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

/// Returns a registry entry for a specified canister ID
///
/// # Arguments
/// * `canister_id` - The Principal ID of the canister to look up
#[query]
fn get_strike_by_canister_id(canister_id: Principal) -> Option<StrikeRegistry> {
    REGISTRY.with(|s| s.borrow().get(&canister_id))
}

/// Adds a new registry entry for a canister
///
/// # Arguments
/// * `canister_id` - The Principal ID of the canister
/// * `name` - Name of the developer or organization
/// * `email` - Contact email
/// * `telegram` - Optional Telegram contact
/// * `twitter` - Optional Twitter handle
/// * `project_name` - Name of the project
/// * `description` - Description of the project/canister
/// * `website_url` - Optional website URL
#[update(guard = "caller_is_not_anonymous")]
fn add_registry(
    canister_id: Principal,
    name: String,
    email: String,
    telegram: Option<String>,
    twitter: Option<String>,
    project_name: String,
    description: String,
    website_url: Option<String>,
) -> Result<(), String> {
    // Input validation
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

#[update(guard = "caller_is_admin")]
fn update_registry_status(canister_id: Principal, status: StrikeStatus) -> Result<(), String> {
    let mut registry = REGISTRY
        .with(|s| s.borrow_mut().get(&canister_id))
        .ok_or("Canister not found")?;

    registry.status = status;

    // Save registry
    REGISTRY.with(|s| s.borrow_mut().insert(canister_id, registry));

    Ok(())
}

#[query(guard = "caller_is_admin")]
fn get_registry() -> Vec<StrikeRegistry> {
    // Add try-catch logic to ensure we don't fail if a single registry fails to decode
    let mut result = Vec::new();

    REGISTRY.with(|s| {
        let registry_ref = s.borrow();
        for (id, _) in registry_ref.iter() {
            // Get each registry with safe handling
            if let Some(registry) = registry_ref.get(&id) {
                result.push(registry);
            }
        }
    });

    result
}

#[query(guard = "caller_is_admin")]
fn get_registry_by_status(status: Option<StrikeStatus>) -> Vec<StrikeRegistry> {
    let mut result = Vec::new();

    REGISTRY.with(|s| {
        let registry_ref = s.borrow();
        for (id, _) in registry_ref.iter() {
            // Get each registry with safe handling
            if let Some(registry) = registry_ref.get(&id) {
                if let Some(filter_status) = status {
                    if registry.status == filter_status {
                        result.push(registry);
                    }
                } else {
                    result.push(registry);
                }
            }
        }
    });

    result
}

#[update(guard = "caller_is_admin")]
pub fn add_admin(admin: Principal) -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    admins::add_admins(caller, [admin].to_vec())
}

#[update(guard = "caller_is_admin")]
pub fn remove_admin(admin: Principal) -> Result<(), String> {
    let caller = ic_cdk::api::caller();
    admins::remove_admins(caller, [admin].to_vec())
}

#[query]
pub fn is_admin(user: Principal) -> bool {
    admins::is_admin(user)
}

ic_cdk::export_candid!();

fn main() {}
