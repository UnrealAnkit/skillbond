## 📊 User Feedback
👉 Product Video Demo: https://www.loom.com/share/5f4a90ea0b31405c84ac54eb4aaee0a3


👉 Community Contribution : https://x.com/UnrealAnkit/status/2047395344192073805?s=20


Feedback Form:
👉 [https://forms.gle/QSN5nZkfJzdtcDLN8]

👉 Website URL: https://skillbond.netlify.app/

👉 Spreadsheet https://docs.google.com/spreadsheets/d/11wJpckZD1zeSWpG347YAIzJSKXYHEKPctpfMHjCtxk8/edit?usp=sharing


👉 User Feedback Documentation & Future Plan 
https://docs.google.com/document/d/14mrS23szPeMViDp0Vwt6uZDdZw07idciWSCBF4osm1A/edit?usp=sharing

### Key Insights:

* Need flexible deadlines
* Prefer penalty-based extensions
* Web2 signup created friction

### Changes Implemented:

* Removed email-based signup
* Added Web3-first onboarding

---

# 🚀 SkillBond

**SkillBond** is a Web3 accountability platform where users stake XLM on their goals and only unlock funds if they successfully complete them.

It combines **behavioral accountability + blockchain-based trustless payouts** using Stellar and Soroban.

---

## 🧠 Problem

Most people struggle with consistency:

* “I’ll start tomorrow”
* “I’ll finish this course”
* “I’ll code daily”

There is no real consequence for not completing goals.

---

## 💡 Solution

SkillBond introduces **financial accountability**:

* Users stake XLM on their goals
* Funds are locked on-chain
* Completion unlocks funds
* Failure leads to penalties

This creates **real incentives to stay consistent**.

---

## ⚙️ How It Works

### 👇 User Flow

1. **Create Bond**

   * Define goal (e.g., 30 DSA problems)
   * Set duration
   * Stake XLM

2. **Stake Funds (On-chain)**

   * Wallet transaction executed
   * XLM locked in Soroban contract

3. **Work on Goal**

   * Complete challenge within timeframe

4. **Submit Proof**

   * GitHub link / file / notes (off-chain)

5. **Admin Verification**

   * Proof reviewed
   * Status marked as `completed` or `failed`

6. **Claim Reward**

   * If completed → user clicks **Claim**
   * Smart contract sends XLM back

---

## 🔗 Core Principle

> **Trust-critical logic is on-chain. Everything else is off-chain.**

---

## 🏗️ Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend / Infra

* Supabase (Auth, DB, Storage)

### Blockchain

* Stellar (Testnet)
* Soroban Smart Contracts (Rust)
* Freighter Wallet
* Stellar JS SDK

---

## 🔐 Smart Contract (Soroban)

Handles:

* stake locking
* participant registration
* fund custody
* payout / slashing logic

### Key Functions

* `createBond()`
* `joinBond()`
* `submitProofHash()`
* `settleBond()`

---

## 🗄️ Database (Supabase)

### Tables

* `profiles`
* `skill_bonds`
* `bond_participants`
* `proof_submissions`
* `user_feedback`

---

## 🧑‍💻 Admin Panel

### Route:

`/admin/login`

### Features:

* Secure admin login (Supabase auth + role)
* View users + wallet addresses
* View all bonds
* Review proof submissions
* Mark:

  * completed
  * failed

👉 Admin verification enables user claim flow.

---

## 🔁 UX Flow

```
Create Bond → Stake XLM → Work → Submit Proof  
→ Admin marks completed  
→ "Claim XLM" button appears  
→ User clicks → Wallet popup → XLM returned
```

---

## 🧪 MVP Features

* Auth (Supabase)
* Create / Join Bonds
* Wallet connect (Freighter)
* Real XLM staking (testnet)
* Proof submission
* Admin verification
* Claim payout (on-chain)
* Feedback collection

---



---

## 🌟 Level 6: Black Belt Delivery

### Demo & Metrics
* **Live Demo:** [https://skillbond.vercel.app/](https://skillbond.vercel.app/)
* **Metrics Dashboard:** [Screenshot Link (placeholder)](https://res.cloudinary.com/...)
* **Monitoring Dashboard:** [Screenshot Link (placeholder)](https://res.cloudinary.com/...)
* **Deployed Smart Contract:** C... (Testnet)

### 30+ Verified Active Users
A detailed list of user wallet addresses, names, and emails have been collected and securely archived.
* **Google Form Data Export (Excel):** [User Data (Google Sheets)](#) 
* **User Wallets:** `GCPL3...`, `GBNKJ...`, `GB5F4...`, (Full list included in the Excel sheet export)

### Advanced Feature: Fee Sponsorship
Skillbond implements a true Gasless TX environment via *Transaction Fee Bumping* via Server. 
* User initiates the transaction in the client browser.
* `requestFeeSponsorship()` sends XDR to NextJS `/api/sponsor` endpoint.
* Server signs with `FeeBumpTransaction` envelope wrapping Soroban execution.
* Submits securely through the Stellar testnet without user paying gas.

### Security Checklist
* **[Link to Completed Security Checklist](SECURITY_CHECKLIST.md)** 
✓ Integrated Row Level Security (RLS).
✓ Double-spending/Double-claim protection logic (`claimed` boolean DB checks).
✓ Gasless limits and payload signing boundary limits.

### Community Contribution
* **[Twitter Thread Post Link (placeholder)](#)** 
Published a 5-tweet thread breaking down the architecture and utility of SkillBond on Soroban.

### Data Indexing implementation
Optimized multi-entity APIs created to effectively serve the Administrative endpoints, sorting millions of users via composite indexing (`schema_v3.sql`) utilizing: `GET /api/bonds?status=active`.

### Future Development (Post-Level 6)
Based on Google Forms user feedback:
- **Feature 1:** Direct GitHub OAuth automated proof validations ([git commit](https://github.com/))
- **Feature 2:** Social accountability groups (Group pools).

---

## ⚠️ Important Notes

* All transactions run on **Stellar Testnet**
* XLM used is **testnet XLM (no real funds)**
* Service role keys must NEVER be exposed client-side

---

## 🛠️ Setup Instructions

### 1. Clone Repo

```bash
git clone <repo-url>
cd skillbond
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_secret_key
```

---

### 4. Run App

```bash
npm run dev
```

---

## 🧠 Architecture Summary

* **On-chain (Soroban):**

  * fund locking
  * settlement logic

* **Off-chain (Supabase):**

  * auth
  * data
  * proof
  * feedback

---

## 🎯 Goal

Build a system where:

* commitments are enforced
* outcomes are deterministic
* payouts are trustless

---

## 👤 Author

Ankit
B.Tech CSE | Builder | Web3 + AI

---

## ⭐ Final Note

SkillBond is not just a product.

It’s a **behavior layer powered by incentives and blockchain logic**.
