import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BondCard } from '@/components/BondCard'
import { Plus, TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bonds } = await supabase
    .from('skill_bonds')
    .select('*, profiles(full_name, username, avatar_url), bond_participants(id, user_id, status)')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false })

  const active = bonds?.filter(b => b.status === 'active' || b.status === 'under_review') ?? []
  const completed = bonds?.filter(b => b.status === 'completed') ?? []
  const failed = bonds?.filter(b => b.status === 'failed') ?? []
  const totalStaked = bonds?.reduce((s, b) => s + Number(b.stake_amount), 0) ?? 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Your accountability bonds</p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-[#00E5A0] text-[#080B0F] font-display font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm shadow-lg"
        >
          <Plus className="w-4 h-4" /> New Bond
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Staked', value: `${totalStaked} XLM`, icon: TrendingUp, color: 'text-[#00E5A0]' },
          { label: 'Active', value: active.length, icon: Clock, color: 'text-blue-400' },
          { label: 'Completed', value: completed.length, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Failed', value: failed.length, icon: XCircle, color: 'text-red-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl border border-white/7 bg-[#0D1117]">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-zinc-500">{label}</span>
            </div>
            <div className={`font-display font-bold text-xl ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {active.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-sm text-zinc-400 uppercase tracking-wider mb-4">Active Bonds</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map((bond: any) => <BondCard key={bond.id} bond={bond} />)}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-sm text-zinc-400 uppercase tracking-wider mb-4">Completed</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((bond: any) => <BondCard key={bond.id} bond={bond} />)}
          </div>
        </section>
      )}

      {failed.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-sm text-zinc-400 uppercase tracking-wider mb-4">Failed</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {failed.map((bond: any) => <BondCard key={bond.id} bond={bond} />)}
          </div>
        </section>
      )}

      {(!bonds || bonds.length === 0) && (
        <div className="text-center py-20 rounded-2xl border border-dashed border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-[#00E5A0]/10 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-7 h-7 text-[#00E5A0]" />
          </div>
          <h3 className="font-display font-semibold text-lg mb-2">No bonds yet</h3>
          <p className="text-zinc-500 text-sm mb-6">Stake your first goal and start building accountability</p>
          <Link href="/create" className="inline-flex items-center gap-2 bg-[#00E5A0] text-[#080B0F] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm">
            <Plus className="w-4 h-4" /> Create Bond
          </Link>
        </div>
      )}
    </div>
  )
}
