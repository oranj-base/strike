mod admins;
mod guards;
mod lifecycle;
mod memory;
mod serializer;
mod strike;
mod types;

#[cfg(test)]
mod test;

use crate::guards::*;
use candid::Principal;
use ic_cdk::{query, update};
use strike::{AddRegistryParams, GetRegistriesParams, StrikeRegistry, UpdateRegistryStatusParams};
use types::PaginatedResponse;

/// Admin
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

#[update(guard = "caller_is_admin")]
pub fn get_admins() -> Vec<Principal> {
    admins::get_admins()
}

#[query]
pub fn get_strike_by_canister_id(canister_id: Principal) -> Option<StrikeRegistry> {
    strike::get_strike_by_canister_id(canister_id)
}

// user
#[update(guard = "caller_is_not_anonymous")]
pub fn add_registry(params: AddRegistryParams) -> Result<(), String> {
    strike::add_registry(
        params.canister_id,
        params.name,
        params.email,
        params.telegram,
        params.twitter,
        params.project_name,
        params.description,
        params.website_url,
    )
}

#[update(guard = "caller_is_admin")]
pub fn update_registry_status(params: UpdateRegistryStatusParams) -> Result<(), String> {
    strike::update_registry_status(params.canister_id, params.status)
}

#[query(guard = "caller_is_admin")]
pub fn get_registries(params: GetRegistriesParams) -> PaginatedResponse<StrikeRegistry> {
    strike::get_registries(params)
}

ic_cdk::export_candid!();
