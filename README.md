# SkillBond — Verifiable Accountability Contracts

Built on Stellar Soroban. Stake XLM on your skill goals. Prove completion. Get paid or get slashed.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# 3. Run the SQL schema
# Open Supabase dashboard → SQL Editor → paste contents of schema.sql

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

## Stack
- **Next.js 14** App Router + TypeScript
- **Supabase** — Auth, PostgreSQL, Storage, RLS
- **Tailwind CSS** + custom design system
- **Soroban** — Stellar smart contracts (scaffolded in `/lib/soroban.ts`)
- **Freighter** — Stellar wallet integration (scaffolded)

## Project Structure
```
app/
  (auth)/login|signup     — Auth pages
  (dashboard)/
    dashboard/            — User bond overview
    create/               — Create new bond
    explore/              — Browse public bonds
    bond/[id]/            — Bond detail + proof review
    bond/[id]/submit/     — Submit completion proof
    feedback/             — User feedback form
components/
  BondCard.tsx            — Bond preview card
  BondStatusBadge.tsx     — Status pill
  BondActions.tsx         — Creator settle buttons
  JoinBondButton.tsx      — Join bond CTA
  WalletConnect.tsx       — Freighter wallet connector
  Navbar.tsx              — Top + mobile nav
lib/
  supabase/client.ts      — Browser Supabase client
  supabase/server.ts      — Server Supabase client
  soroban.ts              — Blockchain abstraction layer ← replace stubs here
  utils.ts                — Helpers, constants
actions/
  bonds.ts                — Bond CRUD server actions
  proofs.ts               — Proof submission server actions
  feedback.ts             — Feedback server action
types/index.ts            — All TypeScript types
middleware.ts             — Route protection
```

## Soroban Integration
All blockchain logic is in `/lib/soroban.ts`. Currently scaffolded with mock responses.
To go live:
1. Deploy `SkillBond.rs` to Stellar testnet
2. Add contract ID to `.env.local`
3. Replace stub functions with real `@stellar/stellar-sdk` calls
4. Connect Freighter via `@stellar/freighter-api`

## Database Schema
See `schema.sql` — includes RLS policies, indexes, and auth trigger.

## Hackathon Requirements Met
- ✅ End-to-end working MVP
- ✅ Auth (signup/login/session)
- ✅ Dashboard with bond status tracking
- ✅ Create, explore, join bonds
- ✅ Proof submission with file upload
- ✅ Feedback collection
- ✅ Soroban placeholder layer (swap in real calls)
- ✅ Clean architecture with server/client separation
- ✅ Mobile responsive
- ✅ RLS-secured database
