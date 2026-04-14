import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: bondsCount } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true })
  const { count: completedCount } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).eq('status', 'completed')
  const { count: activeCount } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).in('status', ['active', 'under_review'])

  return NextResponse.json({
    usersCount: usersCount || 0,
    bondsCount: bondsCount || 0,
    completedCount: completedCount || 0,
    activeCount: activeCount || 0,
  })
}