# Freighter Wallet Setup Guide

## Problem: "Origin not allowed"

If you see this error when clicking the Wallet button:
```
Wallet Error: Freighter wallet not detected. Install from https://freighter.app
```

And you see in the browser console:
```
Origin not allowed (chrome-extension://...)
```

**This means Freighter is installed but blocks localhost from accessing it.**

## Solution: Whitelist localhost:3000

### Step 1: Open Freighter Extension
Click the Freighter wallet icon in your browser toolbar (top right).

### Step 2: Go to Settings
- Click the **gear icon** ⚙️ in the bottom-right corner of the Freighter popup

### Step 3: Add Whitelist Entry
1. Find the **"Advanced"** or **"Whitelist"** section
2. Look for **"Allowed Origins"** or **"Manage Sites"**
3. Click **"Add"** or **"+"** button
4. Enter: `http://localhost:3000`
5. Save/Confirm

### Step 4: Unlock Freighter (if locked)
- Make sure your Freighter wallet is **unlocked** 
- See a lock icon? Click to unlock with your password

### Step 5: Refresh Browser
- Go back to http://localhost:3000
- Refresh the page (Ctrl+R or Cmd+R)
- Click the **Wallet button** again
- Should now say "Connecting..." then show your wallet address ✅

## After Wallet Connects

You should see:
- ✅ Wallet button shows your address (first 5 + last 4 chars)
- ✅ Green checkmark next to the address
- ✅ Your profile name/avatar in the navbar

## Troubleshooting

**Still seeing "Freighter wallet not detected"?**
1. Make sure Freighter is installed (check chrome-extension menu)
2. Open Freighter popup - see the logo?
3. Check if wallet is locked (lock icon means locked)
4. Verify `http://localhost:3000` is in the whitelist (no HTTPS, no trailing slash)

**Seeing "Origin not allowed" in console?**
- This means the origin isn't properly whitelisted
- Try removing and re-adding `http://localhost:3000`
- Restart browser completely

**Connection still fails?**
- Make sure you have XLM in your wallet (for gas fees)
- Check you're on the **Stellar Testnet** in Freighter settings
- Try refreshing the page

## Next Steps

Once wallet is connected:
1. Try creating a bond on the **"Create Bond"** page
2. The "Connect Wallet" will trigger Freighter to sign transactions
3. Your bond will be recorded on the Stellar blockchain!

## Network Info

- **Network**: Stellar Testnet (not mainnet)
- **Contract ID**: `CBWOLMER47SD5T6D635GV6YKNOREBNEYBP63ESQKHUZNIRQLVQS7RH3C`
- **RPC**: `https://soroban-testnet.stellar.org`

## Getting Test XLM

If you need test XLM to pay for transaction fees:

```powershell
# Replace with your public key
$address = "YOUR_PUBLIC_KEY_HERE"
curl "https://friendbot.stellar.org?addr=$address"
```

This gives you 10,000 test XLM on the testnet.
