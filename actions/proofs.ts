'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitProof(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const bondId = formData.get('bond_id') as string
  const proofType = formData.get('proof_type') as string
  const content = formData.get('content') as string
  const linkUrl = formData.get('link_url') as string
  const file = formData.get('file') as File | null

  let fileUrl: string | null = null

  if (file && file.size > 0) {
    const fileName = `${user.id}/${bondId}/${Date.now()}_${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('proofs')
      .upload(fileName, file)

    if (uploadError) return { error: uploadError.message }
    fileUrl = uploadData.path
  }

  const { error } = await supabase.from('proof_submissions').insert({
    bond_id: bondId,
    submitter_id: user.id,
    proof_type: proofType,
    content: content || null,
    link_url: linkUrl || null,
    file_url: fileUrl,
    status: 'pending',
  })

  if (error) return { error: error.message }

  // Mark bond as under review
  await supabase
    .from('skill_bonds')
    .update({ status: 'under_review', updated_at: new Date().toISOString() })
    .eq('id', bondId)
    .eq('creator_id', user.id)

  revalidatePath(`/bond/${bondId}`)
  return { success: true }
}

export async function getProofsForBond(bondId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('proof_submissions')
    .select('*, profiles(full_name, username)')
    .eq('bond_id', bondId)
    .order('submitted_at', { ascending: false })

  if (error) return { error: error.message }
  return { data }
}
