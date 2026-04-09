# SkillBond Contract Deployment Guide

## Prerequisites
- [Stellar CLI](https://developers.stellar.org/docs/build/guides/cli) installed (you have this)
- Rust toolchain: `rustup` with `wasm32-unknown-unknown` target
- Funded testnet account: `GADP7QDQWIEMDYS3I52OO3ECDLH3KBWO53ZA2V6E7U5M265JYVZ76SLT`

## Step 1: Setup Rust Wasm Target
```bash
rustup target add wasm32-unknown-unknown
```

## Step 2: Build the Contract
```bash
cd contracts/skillbond
cargo build --target wasm32-unknown-unknown --release
```

Output: `target/wasm32-unknown-unknown/release/skillbond.wasm`

## Step 3: Deploy to Testnet

```bash
# Set your account
stellar keys generate --testnet skillbond_deployer --fund

# Deploy contract
stellar contract deploy \
  --wasm ./contracts/skillbond/target/wasm32-unknown-unknown/release/skillbond.wasm \
  --network testnet \
  --source skillbond_deployer

# This returns: CONTRACT_ID (save this!)
```

## Step 4: Update `.env.local`
```env
NEXT_PUBLIC_SKILLBOND_CONTRACT_ID=<CONTRACT_ID_FROM_STEP_3>
```

## Step 5: Verify Deployment
```bash
stellar contract info <CONTRACT_ID> --network testnet
```

## Quick Deploy Script (Windows PowerShell)

Create `deploy.ps1`:
```powershell
$CONTRACT_PATH = ".\contracts\skillbond\target\wasm32-unknown-unknown\release\skillbond.wasm"

# Build
Write-Host "Building contract..." -ForegroundColor Cyan
cargo build --target wasm32-unknown-unknown --release --manifest-path .\contracts\skillbond\Cargo.toml

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deploying to testnet..." -ForegroundColor Cyan
    stellar contract deploy `
      --wasm $CONTRACT_PATH `
      --network testnet `
      --source skillbond_deployer
} else {
    Write-Host "Build failed!" -ForegroundColor Red
}
```

Run:
```bash
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

## Test Functions (CLI)

```bash
# Create bond
stellar contract invoke \
  --id <CONTRACT_ID> \
  --network testnet \
  --source skillbond_deployer \
  -- create_bond \
  --creator "<YOUR_ADDRESS>" \
  --bond_id "bond_001" \
  --stake_amount 1000000000 \
  --end_date 1800000000

# Get bond
stellar contract invoke \
  --id <CONTRACT_ID> \
  --network testnet \
  --source skillbond_deployer \
  -- get_bond \
  --bond_id "bond_001"
```

## Need Help?
- Soroban Docs: https://developers.stellar.org/docs/learn/soroban
- Stellar CLI: https://developers.stellar.org/docs/build/guides/cli
- Testnet Status: https://laboratory.stellar.org
