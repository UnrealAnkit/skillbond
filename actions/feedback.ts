'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { logUserActivity } from '@/lib/logger'

export async function submitFeedback(data: {
  bond_id?: string
  rating: number
  feedback_text: string
  issue_type?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('user_feedback').insert({
    user_id: user.id,
    ...data,
  })

  if (error) return { error: error.message }

  await logUserActivity(user.id, 'SUBMIT_FEEDBACK', 'feedback', data.bond_id, {
    rating: data.rating,
    issue_type: data.issue_type || null,
  })

  revalidatePath('/feedback')
  return { success: true }
}
