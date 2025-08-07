use candid::Principal;
use pocket_ic::{query_candid, update_candid_as, PocketIc};

use cargo_metadata::MetadataCommand;
use escargot::CargoBuild;
use std::path::PathBuf;

use crate::strike::{StrikeRegistry, StrikeStatus};

/// Builds a canister with the specified name from the current
/// package and returns the WebAssembly module.
pub fn cargo_build_canister(bin_name: &str) -> Vec<u8> {
    let dir = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap());

    let cargo_toml_path = dir.join("Cargo.toml");

    let target_dir = MetadataCommand::new()
        .manifest_path(&cargo_toml_path)
        .no_deps()
        .exec()
        .expect("failed to run cargo metadata")
        .target_directory;

    // We use a different target path to stop the native cargo build
    // cache being invalidated every time we run this function
    let wasm_target_dir = target_dir.join("canister-build");

    let cargo_build = CargoBuild::new()
        .target("wasm32-unknown-unknown")
        .bin(bin_name)
        // .args(["--profile", "canister-release"])
        .manifest_path(&cargo_toml_path)
        .target_dir(wasm_target_dir);

    let binary = cargo_build.run().expect("Cargo failed to compile the wasm binary");

    std::fs::read(binary.path())
        .unwrap_or_else(|e| panic!("failed to read compiled Wasm file from {}: {}", binary.path().display(), e))
}

// 2T cycles
const INIT_CYCLES: u128 = 2_000_000_000_000;

struct Env {
    pic: PocketIc,
    deployer: Principal,
    canister_id: Principal,
}

fn deploy() -> Env {
    let deployer = Principal::from_text("rrkah-fqaaa-aaaaa-aaaaq-cai").unwrap();
    let pic = PocketIc::new();
    let wasm = cargo_build_canister("strike_backend");
    let canister_id = pic.create_canister_with_settings(Some(deployer), None);
    pic.add_cycles(canister_id, INIT_CYCLES);
    pic.install_canister(canister_id, wasm.clone(), vec![], Some(deployer));

    Env {
        pic,
        deployer,
        canister_id,
    }
}

#[test]
fn deployer_should_be_admin() {
    let env = deploy();

    let (deployer_is_admin,): (bool,) = query_candid(&env.pic, env.canister_id, "is_admin", (env.deployer,)).expect("");
    assert_eq!(deployer_is_admin, true);
}

#[test]
fn should_add_admin() {
    let env = deploy();

    let ali = Principal::from_slice(&[0x01]);

    update_candid_as::<_, (bool,)>(&env.pic, env.canister_id, ali, "add_admin", (ali,)).expect_err("Caller is not a admins");

    let (result,) =
        update_candid_as::<_, (Result<(), String>,)>(&env.pic, env.canister_id, env.deployer, "add_admin", (ali,)).unwrap();

    assert!(result.is_ok());
}

#[test]
fn should_submit_strike() {
    let env = deploy();

    let ali = Principal::from_slice(&[0x01]);

    let canister_id = Principal::from_slice(&[0x02]);

    let (result,) = update_candid_as::<(Principal, Option<String>, Option<String>), (Result<(), String>,)>(
        &env.pic,
        env.canister_id,
        ali,
        "add_registry",
        (canister_id, None, None),
    )
    .unwrap();
    assert!(result.is_ok());

    let (registry,) = query_candid::<(Principal,), (Option<StrikeRegistry>,)>(
        &env.pic,
        env.canister_id,
        "get_strike_by_canister_id",
        (canister_id,),
    )
    .expect("");
    assert_eq!(registry.unwrap().status, StrikeStatus::Submitted);
}

#[test]
fn should_approve_submitted_strike() {
    let env = deploy();

    let ali = Principal::from_slice(&[0x01]);

    let canister_id = Principal::from_slice(&[0x02]);

    let (result,) = update_candid_as::<(Principal, Option<String>, Option<String>), (Result<(), String>,)>(
        &env.pic,
        env.canister_id,
        ali,
        "add_registry",
        (canister_id, None, None),
    )
    .unwrap();
    assert!(result.is_ok());

    let (registry,) = query_candid::<(Principal,), (Option<StrikeRegistry>,)>(
        &env.pic,
        env.canister_id,
        "get_strike_by_canister_id",
        (canister_id,),
    )
    .expect("");
    assert_eq!(registry.unwrap().status, StrikeStatus::Submitted);

    let (result,) = update_candid_as::<(Principal, StrikeStatus), (Result<(), String>,)>(
        &env.pic,
        env.canister_id,
        env.deployer,
        "update_registry_status",
        (canister_id, StrikeStatus::Trusted),
    )
    .unwrap();
    assert!(result.is_ok());

    let (registry,) = query_candid::<(Principal,), (Option<StrikeRegistry>,)>(
        &env.pic,
        env.canister_id,
        "get_strike_by_canister_id",
        (canister_id,),
    )
    .expect("");
    assert_eq!(registry.unwrap().status, StrikeStatus::Trusted);
}
