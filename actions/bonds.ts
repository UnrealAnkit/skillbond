'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { CreateBondInput } from '@/types'
import { sorobanService } from '@/lib/soroban'

export async function createBond(input: CreateBondInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Ensure profile exists to satisfy foreign key constraint
  const profileResponse = await supabase.from('profiles').select('id').eq('id', user.id).single()
  if (!profileResponse.data) {
    await supabase.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    })
  }

  const { data, error } = await supabase
    .from('skill_bonds')
    .insert({
      ...input,
      creator_id: user.id,
      status: 'active',
      soroban_tx_hash: input.soroban_tx_hash || null,
      soroban_contract_id: input.soroban_tx_hash ? 'pending_contract_verify' : null,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  // If a real tx was completely skipped (maybe 0 stake), scaffold mock
  if (data && input.stake_amount > 0 && !input.soroban_tx_hash) {
    const sorobanResult = await sorobanService.createBond({
      bondId: data.id,
      creatorAddress: 'pending_wallet',
      stakeAmount: input.stake_amount,
      currency: 'XLM',
      endDate: input.end_date,
    })
    if (sorobanResult.success) {
      await supabase
        .from('skill_bonds')
        .update({
          soroban_contract_id: sorobanResult.contractId,
          soroban_tx_hash: sorobanResult.txHash,
        })
        .eq('id', data.id)
    }
  }

  revalidatePath('/dashboard')
  return { data }
}

export async function getBonds(filter?: { status?: string; mine?: boolean }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('skill_bonds')
    .select('*, profiles(full_name, username, avatar_url), bond_participants(id, user_id, status)')
    .order('created_at', { ascending: false })

  if (filter?.mine && user) {
    query = query.eq('creator_id', user.id)
  } else {
    query = query.eq('visibility', 'public')
  }

  if (filter?.status) {
    query = query.eq('status', filter.status)
  }

  const { data, error } = await query
  if (error) return { error: error.message }
  return { data }
}

export async function getBondById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skill_bonds')
    .select('*, profiles(full_name, username, avatar_url, wallet_address), bond_participants(*, profiles(full_name, username, avatar_url))')
    .eq('id', id)
    .single()

  if (error) return { error: error.message }
  return { data }
}

export async function joinBond(bondId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Ensure profile exists to satisfy foreign key constraint
  const profileResponse = await supabase.from('profiles').select('id').eq('id', user.id).single()
  if (!profileResponse.data) {
    await supabase.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    })
  }

  const { data: bond } = await supabase
    .from('skill_bonds')
    .select('stake_amount')
    .eq('id', bondId)
    .single()

  const { error } = await supabase
    .from('bond_participants')
    .insert({ bond_id: bondId, user_id: user.id })

  if (error) return { error: error.message }

  // Scaffold Soroban join
  if (bond) {
    await sorobanService.joinBond(bondId, 'pending_wallet', bond.stake_amount)
  }

  revalidatePath(`/bond/${bondId}`)
  return { success: true }
}

export async function updateBondStatus(bondId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('skill_bonds')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bondId)
    .eq('creator_id', user.id)

  if (error) return { error: error.message }

  // Scaffold Soroban settle
  if (status === 'completed' || status === 'failed') {
    await sorobanService.settleBond(bondId, status as 'completed' | 'failed')
  }

  revalidatePath(`/bond/${bondId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

import { logUserActivity } from '@/lib/logger';

export async function claimBondAction(bondId: string, txHash: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not logged in')
  }

  // Prevent double claiming
  const { data: participantData } = await supabase
    .from('bond_participants')
    .select('claimed')
    .eq('user_id', user.id)
    .eq('bond_id', bondId)
    .single();

  if (participantData?.claimed) {
    await logUserActivity(user.id, 'ERROR_DOUBLE_CLAIM_ATTEMPT', 'bond', bondId);
    throw new Error('Funds have already been claimed.');
  }

  // Update status to 'claimed', set soroban_tx_hash
  const { error } = await supabase
    .from('skill_bonds')
    .update({ 
      status: 'claimed',
      soroban_tx_hash: txHash,
      updated_at: new Date().toISOString()
    })
    .eq('id', bondId)
    .eq('status', 'completed') // Important: Ensure it is completed

  if (error) {
    await logUserActivity(user.id, 'ERROR_CLAIM_FAILED', 'bond', bondId, { error: error.message });
    throw new Error(error.message)
  }

  // Mark as claimed for the participant
  await supabase
    .from('bond_participants')
    .update({ claimed: true })
    .eq('user_id', user.id)
    .eq('bond_id', bondId);

  await logUserActivity(user.id, 'CLAIM_BOND', 'bond', bondId, { txHash });

  revalidatePath(`/bond/${bondId}`)
  revalidatePath('/dashboard')

  return { success: true }
}
