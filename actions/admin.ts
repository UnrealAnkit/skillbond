'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/admin/login');
  }

  return user;
}

export async function getAdminStats() {
  const supabase = await createClient();
  await checkAdmin();

  // Basic stats
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: totalBonds } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true });
  const { count: activeBonds } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).eq('status', 'active');
  const { count: completedBonds } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).eq('status', 'completed');
  const { count: failedBonds } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).eq('status', 'failed');
  
  // Total XLM Staked
  const { data: bondsData } = await supabase.from('skill_bonds').select('stake_amount');
  const totalStaked = bondsData?.reduce((acc, bond) => acc + (Number(bond.stake_amount) || 0), 0) || 0;

  return {
    totalUsers: totalUsers || 0,
    totalBonds: totalBonds || 0,
    activeBonds: activeBonds || 0,
    completedBonds: completedBonds || 0,
    failedBonds: failedBonds || 0,
    totalStaked
  };
}

export async function getUsers() {
  const supabase = await createClient();
  await checkAdmin();

  const { data: users, error } = await supabase
    .from('profiles')
    .select(`
      id,
      username,
      wallet_address,
      created_at,
      skill_bonds!skill_bonds_creator_id_fkey(count),
      bond_participants(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return users.map(user => ({
    ...user,
    email: user.username || `User_${user.id.substring(0,6)}`,
    bondsCreated: user.skill_bonds[0]?.count || 0,
    bondsJoined: user.bond_participants[0]?.count || 0,
  }));
}

export async function getBondsWithDetails() {
  const supabase = await createClient();
  await checkAdmin();

  const { data: bonds, error } = await supabase
    .from('skill_bonds')
    .select(`
      *,
      profiles!skill_bonds_creator_id_fkey(username),
      bond_participants(
        user_id,
        status,
        joined_at,
        profiles(username, wallet_address)
      ),
      proof_submissions(
        id,
        submitter_id,
        proof_type,
        content,
        file_url,
        link_url,
        status,
        submitted_at,
        profiles(username)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bonds:', error);
    return [];
  }

  return bonds.map(bond => ({
    ...bond,
    profiles: {
      ...bond.profiles,
      email: bond.profiles?.username || `User_${bond.creator_id?.substring(0,6)}`
    },
    bond_participants: bond.bond_participants?.map((participant: any) => ({
      ...participant,
      payout_status: 'n/a',
      profiles: {
        ...participant.profiles,
        email: participant.profiles?.username || `User_${participant.user_id?.substring(0,6)}`
      }
    })),
    proof_submissions: bond.proof_submissions?.map((submission: any) => ({
      ...submission,
      proof_url: submission.link_url || submission.file_url,
      notes: submission.content || submission.reviewer_notes,
      profiles: {
        ...submission.profiles,
        email: submission.profiles?.username || `User_${submission.submitter_id?.substring(0,6)}`
      }
    }))
  }));
}

export async function updateBondStatus(bondId: string, status: 'completed' | 'failed') {
  const supabase = await createClient();
  await checkAdmin();

  const { data: bond } = await supabase
    .from('skill_bonds')
    .select('status')
    .eq('id', bondId)
    .single();

  if (bond?.status === 'completed' || bond?.status === 'failed') {
    return { error: 'Status already finalized' };
  }

  const { error } = await supabase
    .from('skill_bonds')
    .update({ status })
    .eq('id', bondId);

  if (error) {
    console.error('Error updating bond status:', error);
    return { error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}