export type BondStatus = 'draft' | 'active' | 'completed' | 'failed' | 'under_review'
export type ProofType = 'github' | 'screenshot' | 'link' | 'manual'
export type Visibility = 'public' | 'private'

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  wallet_address: string | null
  reputation_score: number
  created_at: string
}

export interface SkillBond {
  id: string
  creator_id: string
  title: string
  description: string | null
  category: string
  stake_amount: number
  currency: string
  start_date: string
  end_date: string
  proof_type: ProofType
  visibility: Visibility
  status: BondStatus
  soroban_contract_id: string | null
  soroban_tx_hash: string | null
  max_participants: number
  created_at: string
  updated_at: string
  profiles?: Profile
  bond_participants?: BondParticipant[]
}

export interface BondParticipant {
  id: string
  bond_id: string
  user_id: string
  joined_at: string
  status: 'active' | 'completed' | 'failed'
  profiles?: Profile
}

export interface ProofSubmission {
  id: string
  bond_id: string
  submitter_id: string
  proof_type: string
  content: string | null
  file_url: string | null
  link_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  reviewer_notes: string | null
  submitted_at: string
}

export interface UserFeedback {
  id: string
  user_id: string
  bond_id: string | null
  rating: number
  feedback_text: string | null
  issue_type: string | null
  created_at: string
}

export interface CreateBondInput {
  title: string
  description: string
  category: string
  stake_amount: number
  start_date: string
  end_date: string
  proof_type: ProofType
  visibility: Visibility
}
