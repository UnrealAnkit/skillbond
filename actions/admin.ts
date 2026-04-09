'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateBondStatus(bondId: string, status: 'completed' | 'failed') {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  // Here you can verify if the user has the 'admin' role. 
  // Assuming the user will handle admin permissions natively.
  
  const { error } = await supabase
    .from('skill_bonds')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', bondId);

  if (error) throw new Error(error.message);
  
  revalidatePath('/admin');
  revalidatePath(`/bond/${bondId}`);
}