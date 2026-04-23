import type { PostgrestError } from '@supabase/supabase-js'

const TRANSACTION_ACTIONS = ['CREATE_BOND', 'JOIN_BOND', 'SUBMIT_PROOF', 'SETTLE_BOND', 'CLAIM_BOND'] as const

type ActivityRow = {
  user_id: string | null
  action: string
  created_at: string
}

export type PlatformMetrics = {
  totalUsers: number
  totalBonds: number
  activeBonds: number
  completedBonds: number
  failedBonds: number
  totalXlmStaked: number
  activeUsers24h: number
  dau: number
  transactions24h: number
  transactions30d: number
  totalTransactions: number
  retention7d: number
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function isUnavailableActivitySource(error: PostgrestError | null): boolean {
  // 42P01: missing relation, 42501: insufficient privilege (RLS/policy)
  return Boolean(error && (error.code === '42P01' || error.code === '42501'))
}

function uniqueUserCount(rows: ActivityRow[]): number {
  return new Set(rows.filter((row) => row.user_id).map((row) => row.user_id as string)).size
}

function retentionPercent(previous: Set<string>, current: Set<string>): number {
  if (previous.size === 0) return 0

  let retained = 0
  for (const userId of previous) {
    if (current.has(userId)) retained += 1
  }

  return Number(((retained / previous.size) * 100).toFixed(1))
}

function filterByAction(rows: ActivityRow[]): ActivityRow[] {
  return rows.filter((row) => TRANSACTION_ACTIONS.includes(row.action as (typeof TRANSACTION_ACTIONS)[number]))
}

async function readActivityWindow(supabase: any, fromIso: string, toIso?: string): Promise<ActivityRow[] | null> {
  let query = supabase
    .from('activity_logs')
    .select('user_id, action, created_at')
    .gte('created_at', fromIso)

  if (toIso) {
    query = query.lt('created_at', toIso)
  }

  const { data, error } = await query

  if (isUnavailableActivitySource(error)) {
    return null
  }

  if (error) {
    throw error
  }

  return (data || []) as ActivityRow[]
}

async function fallbackActivityWindow(supabase: any, fromIso: string, toIso?: string): Promise<ActivityRow[]> {
  let bondsQuery = supabase
    .from('skill_bonds')
    .select('creator_id, created_at')
    .gte('created_at', fromIso)

  let participantsQuery = supabase
    .from('bond_participants')
    .select('user_id, joined_at')
    .gte('joined_at', fromIso)

  let proofsQuery = supabase
    .from('proof_submissions')
    .select('submitter_id, submitted_at')
    .gte('submitted_at', fromIso)

  let feedbackQuery = supabase
    .from('user_feedback')
    .select('user_id, created_at')
    .gte('created_at', fromIso)

  if (toIso) {
    bondsQuery = bondsQuery.lt('created_at', toIso)
    participantsQuery = participantsQuery.lt('joined_at', toIso)
    proofsQuery = proofsQuery.lt('submitted_at', toIso)
    feedbackQuery = feedbackQuery.lt('created_at', toIso)
  }

  const [bondsRes, participantsRes, proofsRes, feedbackRes] = await Promise.all([
    bondsQuery,
    participantsQuery,
    proofsQuery,
    feedbackQuery,
  ])

  if (bondsRes.error) throw bondsRes.error
  if (participantsRes.error) throw participantsRes.error
  if (proofsRes.error) throw proofsRes.error
  if (feedbackRes.error) throw feedbackRes.error

  const rows: ActivityRow[] = []

  for (const bond of bondsRes.data || []) {
    rows.push({
      user_id: bond.creator_id,
      action: 'CREATE_BOND',
      created_at: bond.created_at,
    })
  }

  for (const participant of participantsRes.data || []) {
    rows.push({
      user_id: participant.user_id,
      action: 'JOIN_BOND',
      created_at: participant.joined_at,
    })
  }

  for (const proof of proofsRes.data || []) {
    rows.push({
      user_id: proof.submitter_id,
      action: 'SUBMIT_PROOF',
      created_at: proof.submitted_at,
    })
  }

  for (const feedback of feedbackRes.data || []) {
    rows.push({
      user_id: feedback.user_id,
      action: 'SUBMIT_FEEDBACK',
      created_at: feedback.created_at,
    })
  }

  return rows
}

async function getActivityWindow(supabase: any, fromIso: string, toIso?: string): Promise<ActivityRow[]> {
  const rowsFromLogs = await readActivityWindow(supabase, fromIso, toIso)

  if (rowsFromLogs) {
    return rowsFromLogs
  }

  return fallbackActivityWindow(supabase, fromIso, toIso)
}

async function getTotalTransactions(supabase: any): Promise<number> {
  const { count, error } = await supabase
    .from('activity_logs')
    .select('*', { count: 'exact', head: true })
    .in('action', [...TRANSACTION_ACTIONS])

  if (!error) {
    return count || 0
  }

  if (!isUnavailableActivitySource(error)) {
    throw error
  }

  const [bondsCount, participantsCount, proofsCount, claimedCount] = await Promise.all([
    supabase.from('skill_bonds').select('*', { count: 'exact', head: true }),
    supabase.from('bond_participants').select('*', { count: 'exact', head: true }),
    supabase.from('proof_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).eq('status', 'claimed'),
  ])

  if (bondsCount.error) throw bondsCount.error
  if (participantsCount.error) throw participantsCount.error
  if (proofsCount.error) throw proofsCount.error
  if (claimedCount.error) throw claimedCount.error

  return (bondsCount.count || 0) + (participantsCount.count || 0) + (proofsCount.count || 0) + (claimedCount.count || 0)
}

export async function getPlatformMetrics(supabase: any): Promise<PlatformMetrics> {
  const oneDayAgo = isoDaysAgo(1)
  const sevenDaysAgo = isoDaysAgo(7)
  const fourteenDaysAgo = isoDaysAgo(14)
  const thirtyDaysAgo = isoDaysAgo(30)

  const [
    totalUsersRes,
    totalBondsRes,
    activeBondsRes,
    completedBondsRes,
    failedBondsRes,
    stakeDataRes,
    activity24h,
    activity30d,
    activityRecent7,
    activityPrevious7,
    totalTransactions,
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('skill_bonds').select('*', { count: 'exact', head: true }),
    supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
    supabase.from('skill_bonds').select('stake_amount'),
    getActivityWindow(supabase, oneDayAgo),
    getActivityWindow(supabase, thirtyDaysAgo),
    getActivityWindow(supabase, sevenDaysAgo),
    getActivityWindow(supabase, fourteenDaysAgo, sevenDaysAgo),
    getTotalTransactions(supabase),
  ])

  if (totalUsersRes.error) throw totalUsersRes.error
  if (totalBondsRes.error) throw totalBondsRes.error
  if (activeBondsRes.error) throw activeBondsRes.error
  if (completedBondsRes.error) throw completedBondsRes.error
  if (failedBondsRes.error) throw failedBondsRes.error
  if (stakeDataRes.error) throw stakeDataRes.error

  const totalXlmStaked = (stakeDataRes.data || []).reduce((sum: number, bond: { stake_amount: string | number | null }) => {
    return sum + Number(bond.stake_amount || 0)
  }, 0)

  const activity24hUsers = uniqueUserCount(activity24h)
  const transaction24h = filterByAction(activity24h).length
  const transaction30d = filterByAction(activity30d).length
  const recentUsers = new Set(activityRecent7.filter((row) => row.user_id).map((row) => row.user_id as string))
  const previousUsers = new Set(activityPrevious7.filter((row) => row.user_id).map((row) => row.user_id as string))

  return {
    totalUsers: totalUsersRes.count || 0,
    totalBonds: totalBondsRes.count || 0,
    activeBonds: activeBondsRes.count || 0,
    completedBonds: completedBondsRes.count || 0,
    failedBonds: failedBondsRes.count || 0,
    totalXlmStaked,
    activeUsers24h: activity24hUsers,
    dau: activity24hUsers,
    transactions24h: transaction24h,
    transactions30d: transaction30d,
    totalTransactions,
    retention7d: retentionPercent(previousUsers, recentUsers),
  }
}
