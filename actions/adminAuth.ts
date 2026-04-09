'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Verify Admin Role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profile?.role !== 'admin') {
    // Log them back out if not admin
    await supabase.auth.signOut();
    return { error: 'Unauthorized: Admin access required.' };
  }

  return { success: true };
}