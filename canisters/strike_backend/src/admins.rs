use candid::Principal;

use crate::memory::ADMINS;

pub fn add_admins_unchecked(admins_to_add: Vec<Principal>) -> Result<(), String> {
    ADMINS.with(|admins| {
        let mut admins = admins.borrow_mut();
        for admin in admins_to_add {
            admins.insert(admin.into(), 1u8);
        }
        Ok(())
    })
}

pub fn remove_admins_unchecked(admins_to_remove: Vec<Principal>) -> Result<(), String> {
    ADMINS.with(|admins| {
        let mut admins = admins.borrow_mut();
        for admin in admins_to_remove {
            admins.remove(&admin.into());
        }
        Ok(())
    })
}

pub fn is_admin(principal: Principal) -> bool {
    ADMINS.with(|admins| admins.borrow().get(&principal.into()).unwrap_or_default().eq(&1u8))
}

pub fn add_admins(caller: Principal, admins_to_add: Vec<Principal>) -> Result<(), String> {
    if !is_admin(caller) {
        return Err(format!("{} is not an admin.", caller));
    }

    for admin in &admins_to_add {
        if is_admin(*admin) {
            return Err(format!("{} is already an admin.", admin));
        }
    }

    add_admins_unchecked(admins_to_add)
}

pub fn remove_admins(caller: Principal, admins_to_remove: Vec<Principal>) -> Result<(), String> {
    if !is_admin(caller) {
        return Err(format!("{} is not an admin.", caller));
    }

    for admin in &admins_to_remove {
        if !is_admin(*admin) {
            return Err(format!("{} is not an admin.", admin));
        }
    }

    remove_admins_unchecked(admins_to_remove)
}

pub fn get_admins() -> Vec<Principal> {
    ADMINS.with(|admins| {
        admins
            .borrow()
            .iter()
            .filter_map(|(principal, _)| Principal::try_from(principal).ok())
            .collect()
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    const ALI: Principal = Principal::from_slice(&[0; 24]);
    const BOB: Principal = Principal::from_slice(&[1; 24]);

    #[test]
    fn test_add_admins() {
        add_admins_unchecked(vec![ALI]).unwrap();
        assert!(is_admin(ALI));
        assert!(!is_admin(BOB));

        add_admins(ALI, vec![BOB]).unwrap();
        assert!(is_admin(ALI));
        assert!(is_admin(BOB));
    }

    #[test]
    fn test_remove_admins() {
        add_admins_unchecked(vec![ALI, BOB]).unwrap();
        assert!(is_admin(ALI));
        assert!(is_admin(BOB));

        remove_admins(BOB, vec![ALI]).unwrap();
        assert!(!is_admin(ALI));
        assert!(is_admin(BOB));
    }
}
