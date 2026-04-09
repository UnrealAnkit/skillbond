-- =============================================
-- SkillBond Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- PROFILES
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  wallet_address text,
  reputation_score integer default 0,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view all profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- SKILL BONDS
create table if not exists skill_bonds (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  description text,
  category text not null,
  stake_amount numeric(18,6) not null default 0,
  currency text default 'XLM',
  start_date date not null,
  end_date date not null,
  proof_type text check (proof_type in ('github','screenshot','link','manual')) default 'manual',
  visibility text check (visibility in ('public','private')) default 'public',
  status text check (status in ('draft','active','completed','failed','under_review')) default 'draft',
  soroban_contract_id text,
  soroban_tx_hash text,
  max_participants integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists skill_bonds_creator_idx on skill_bonds(creator_id);
create index if not exists skill_bonds_status_idx on skill_bonds(status);
create index if not exists skill_bonds_visibility_idx on skill_bonds(visibility);

alter table skill_bonds enable row level security;
create policy "Public bonds visible to all" on skill_bonds for select using (visibility = 'public' or creator_id = auth.uid());
create policy "Authenticated users can create bonds" on skill_bonds for insert with check (auth.uid() = creator_id);
create policy "Creators can update own bonds" on skill_bonds for update using (auth.uid() = creator_id);

-- BOND PARTICIPANTS
create table if not exists bond_participants (
  id uuid default gen_random_uuid() primary key,
  bond_id uuid references skill_bonds(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  joined_at timestamptz default now(),
  status text check (status in ('active','completed','failed')) default 'active',
  unique(bond_id, user_id)
);

create index if not exists bond_participants_bond_idx on bond_participants(bond_id);
create index if not exists bond_participants_user_idx on bond_participants(user_id);

alter table bond_participants enable row level security;
create policy "Participants visible to bond creator and self" on bond_participants for select using (
  user_id = auth.uid() or
  exists (select 1 from skill_bonds where id = bond_id and creator_id = auth.uid())
);
create policy "Authenticated users can join bonds" on bond_participants for insert with check (auth.uid() = user_id);
create policy "Users can update own participation" on bond_participants for update using (auth.uid() = user_id);

-- PROOF SUBMISSIONS
create table if not exists proof_submissions (
  id uuid default gen_random_uuid() primary key,
  bond_id uuid references skill_bonds(id) on delete cascade not null,
  submitter_id uuid references profiles(id) on delete cascade not null,
  proof_type text not null,
  content text,
  file_url text,
  link_url text,
  status text check (status in ('pending','approved','rejected')) default 'pending',
  reviewer_notes text,
  submitted_at timestamptz default now()
);

create index if not exists proof_submissions_bond_idx on proof_submissions(bond_id);
create index if not exists proof_submissions_submitter_idx on proof_submissions(submitter_id);

alter table proof_submissions enable row level security;
create policy "Submitters and bond creators can view proofs" on proof_submissions for select using (
  submitter_id = auth.uid() or
  exists (select 1 from skill_bonds where id = bond_id and creator_id = auth.uid())
);
create policy "Participants can submit proofs" on proof_submissions for insert with check (auth.uid() = submitter_id);

-- USER FEEDBACK
create table if not exists user_feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete set null,
  bond_id uuid references skill_bonds(id) on delete set null,
  rating integer check (rating between 1 and 5),
  feedback_text text,
  issue_type text,
  created_at timestamptz default now()
);

alter table user_feedback enable row level security;
create policy "Users can insert feedback" on user_feedback for insert with check (auth.uid() = user_id);
create policy "Users can view own feedback" on user_feedback for select using (auth.uid() = user_id);

-- AUTO-CREATE PROFILE ON SIGNUP
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- STORAGE BUCKET FOR PROOF FILES
insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', false)
on conflict (id) do nothing;

create policy "Authenticated users can upload proofs"
on storage.objects for insert
with check (bucket_id = 'proofs' and auth.role() = 'authenticated');

create policy "Users can view own proof files"
on storage.objects for select
using (bucket_id = 'proofs' and auth.uid()::text = (storage.foldername(name))[1]);
