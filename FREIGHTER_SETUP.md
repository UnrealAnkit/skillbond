# Freighter Wallet Connection Guide

## Prerequisites
1. **Freighter Installed**: https://freighter.app
2. **Testnet Account**: Must have XLM balance on Stellar testnet
3. **Origin Whitelisted**: localhost:3000 must be allowed in Freighter

## Setup Steps

### 1. Install Freighter
- Go to https://freighter.app
- Install for your browser (Chrome, Firefox, etc.)
- Create or import wallet

### 2. Fund Your Testnet Account
```powershell
# Use FriendBot to fund testnet account
$address = "GADP7QDQWIEMDYS3I52OO3ECDLH3KBWO53ZA2V6E7U5M265JYVZ76SLT"
curl "https://friendbot.stellar.org?addr=$address"
```

### 3. Configure Freighter for localhost:3000

**Chrome/Brave:**
1. Open Freighter extension
2. Go to Settings ⚙️
3. Find "Domain/Origins" or "Permissions"
4. Add: `http://localhost:3000`
5. Save

**Firefox:**
1. Open Freighter extension
2. Click Settings ⚙️
3. Look for "Allowed Sites" or "Origins"
4. Add: `http://localhost:3000`
5. Save

### 4. Test Connection

Open http://localhost:3000/dashboard in browser:
1. Click "Connect Wallet" button (top right)
2. Freighter popup should appear
3. Click "Approve" or "Connect"
4. Your wallet address will appear (GADP7...)

## Troubleshooting

### "Origin not allowed" Error
- ✅ Solution: Add `http://localhost:3000` to Freighter allowed origins

### Button says "Freighter wallet not detected"
- ✅ Solution: Install Freighter extension: https://freighter.app
- Check browser console (`F12`) for errors

### Cannot get public key
- ✅ Solution: Make sure you've created/imported a wallet in Freighter
- Try refreshing the page
- Check Freighter is unlocked (not locked)

### Connection times out
- ✅ Solution: Check Freighter settings allow localhost:3000
- Try different browser if available
- Restart browser extension: Disable/Re-enable in extensions page

## Debug Checklist
```
□ Freighter installed and visible in browser
□ Freighter unlocked (not showing lock screen)
□ Wallet has XLM balance (check in Freighter)
□ localhost:3000 in Freighter allowed origins
□ Browser console (F12) shows no errors
□ SkillBond app shows "Connect Wallet" button
□ Can see wallet address after connecting
```

## Quick Test
When connected, you should see:
- Wallet address displayed in navbar (e.g., GADP7...76SLT)
- Green checkmark icon next to address
- Connected state persists on page reload

## Still Having Issues?
1. Check browser console for errors: `F12` → Console tab
2. Check Freighter logs
3. Try incognito/private window
4. Clear browser cache
5. Reinstall Freighter extension
