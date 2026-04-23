# Level 6 Security Configuration

- [x] RLS enabled on all schema tables.
- [x] Admin routes protected securely via `auth.getUser()` and JWT metadata.
- [x] Database explicitly prevents double claims (`claimed` boolean checked).
- [x] Metrics endpoints gated behind admin privileges.
- [x] Error boundaries setup to swallow crashes safely.

**Keys Strategy**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` is completely untrusted, and `SUPABASE_SERVICE_ROLE_KEY` is strictly sequestered to `/api` and Server Actions.
