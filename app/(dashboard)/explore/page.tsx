import { createClient } from '@/lib/supabase/server'
import { BondCard } from '@/components/BondCard'
import Link from 'next/link'
import { Compass, Plus } from 'lucide-react'

export default async function ExplorePage() {
  const supabase = await createClient()

  const { data: bonds } = await supabase
    .from('skill_bonds')
    .select('*, profiles(full_name, username, avatar_url), bond_participants(id, user_id, status)')
    .eq('visibility', 'public')
    .in('status', ['active', 'under_review'])
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-[#00E5A0]" />
            Explore Bonds
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Join public accountability challenges from the community</p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 border border-white/10 text-zinc-300 font-semibold px-4 py-2 rounded-xl hover:border-white/20 hover:bg-white/5 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Create yours
        </Link>
      </div>

      {bonds && bonds.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bonds.map((bond: any) => <BondCard key={bond.id} bond={bond} />)}
        </div>
      ) : (
        <div className="text-center py-24 rounded-2xl border border-dashed border-white/10">
          <Compass className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-lg mb-2">No public bonds yet</h3>
          <p className="text-zinc-500 text-sm mb-6">Be the first to create a public SkillBond</p>
          <Link href="/create" className="inline-flex items-center gap-2 bg-[#00E5A0] text-[#080B0F] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm">
            <Plus className="w-4 h-4" /> Create Bond
          </Link>
        </div>
      )}
    </div>
  )
}
