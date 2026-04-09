#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Address, Map, Bytes, I256};

#[contract]
pub struct SkillBond;

#[contractimpl]
impl SkillBond {
    /// Create a new skill bond with stake
    pub fn create_bond(
        env: Env,
        creator: Address,
        bond_id: Bytes,
        stake_amount: I256,
        end_date: u64,
    ) -> Bytes {
        creator.require_auth();
        
        // Store bond: bonds -> {bond_id -> {creator, stake, end_date, status}}
        let mut bonds: Map<Bytes, (Address, I256, u64, u32)> = env
            .storage()
            .persistent()
            .get(&symbol_short!("bonds"))
            .unwrap_or_else(|| Map::new(&env));

        bonds.set(bond_id.clone(), (creator, stake_amount, end_date, 1)); // 1 = active
        env.storage().persistent().set(&symbol_short!("bonds"), &bonds);

        bond_id
    }

    /// Join an existing bond
    pub fn join_bond(
        env: Env,
        participant: Address,
        bond_id: Bytes,
        stake_amount: I256,
    ) -> bool {
        participant.require_auth();

        let bonds: Map<Bytes, (Address, I256, u64, u32)> = env
            .storage()
            .persistent()
            .get(&symbol_short!("bonds"))
            .unwrap_or_else(|| Map::new(&env));

        if bonds.contains_key(bond_id.clone()) {
            // Record participant
            let mut parts: Map<(Bytes, Address), I256> = env
                .storage()
                .persistent()
                .get(&symbol_short!("parts"))
                .unwrap_or_else(|| Map::new(&env));

            parts.set((bond_id, participant), stake_amount);
            env.storage().persistent().set(&symbol_short!("parts"), &parts);
            
            return true;
        }
        false
    }

    /// Settle bond - mark as completed or failed
    pub fn settle_bond(
        env: Env,
        bond_id: Bytes,
        outcome: u32, // 1 = completed, 2 = failed
    ) -> bool {
        let mut bonds: Map<Bytes, (Address, I256, u64, u32)> = env
            .storage()
            .persistent()
            .get(&symbol_short!("bonds"))
            .unwrap_or_else(|| Map::new(&env));

        if let Some((creator, stake, end_date, _status)) = bonds.get(bond_id.clone()) {
            bonds.set(bond_id, (creator, stake, end_date, outcome));
            env.storage().persistent().set(&symbol_short!("bonds"), &bonds);
            return true;
        }
        false
    }

    /// Get bond info
    pub fn get_bond(env: Env, bond_id: Bytes) -> Option<(Address, I256, u64, u32)> {
        let bonds: Map<Bytes, (Address, I256, u64, u32)> = env
            .storage()
            .persistent()
            .get(&symbol_short!("bonds"))
            .unwrap_or_else(|| Map::new(&env));

        bonds.get(bond_id)
    }
}
