import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { BondStatusBadge } from '@/components/BondStatusBadge'
import { formatDate, timeLeft, formatXLM } from '@/lib/utils'
import { ArrowLeft, Lock, Calendar, Users, GitBranch, ExternalLink, Clock } from 'lucide-react'
import { JoinBondButton } from '@/components/JoinBondButton'
import { BondActions } from '@/components/BondActions'

export default async function BondDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: bond } = await supabase
    .from('skill_bonds')
    .select('*, profiles(full_name, username, avatar_url, wallet_address), bond_participants(*, profiles(full_name, username))')
    .eq('id', id)
    .single()

  if (!bond) notFound()

  const isCreator = bond.creator_id === user.id
  const isParticipant = bond.bond_participants?.some((p: any) => p.user_id === user.id)

  const { data: proofs } = await supabase
    .from('proof_submissions')
    .select('*, profiles(full_name)')
    .eq('bond_id', id)
    .order('submitted_at', { ascending: false })

  const proofStatusColor: Record<string, string> = {
    approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/25',
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-100 text-sm transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to dashboard
      </Link>

      {/* Hero card */}
      <div className="rounded-2xl border border-white/10 bg-[#0D1117] p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#00E5A0] font-semibold mb-1.5">{bond.category}</p>
            <h1 className="font-display font-bold text-xl tracking-tight leading-snug">{bond.title}</h1>
            {bond.description && (
              <p className="text-zinc-400 text-sm mt-2.5 leading-relaxed">{bond.description}</p>
            )}
          </div>
          <BondStatusBadge status={bond.status} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Lock, label: 'Staked', value: formatXLM(bond.stake_amount), color: 'text-[#00E5A0]' },
            { icon: Calendar, label: 'Ends', value: formatDate(bond.end_date), color: 'text-zinc-200' },
            { icon: Users, label: 'Participants', value: String(bond.bond_participants?.length ?? 0), color: 'text-zinc-200' },
            { icon: GitBranch, label: 'Proof', value: bond.proof_type, color: 'text-zinc-200' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="p-3 rounded-xl bg-white/4 border border-white/7">
              <div className="flex items-center gap-1.5 text-zinc-500 mb-1.5">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs">{label}</span>
              </div>
              <div className={`text-sm font-semibold ${color} capitalize`}>{value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-4 text-sm text-zinc-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeLeft(bond.end_date)}</span>
          <span className="text-zinc-700">·</span>
          <span>Started {formatDate(bond.start_date)}</span>
          {bond.profiles && (
            <>
              <span className="text-zinc-700">·</span>
              <span>by {bond.profiles.full_name || bond.profiles.username || 'Anonymous'}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {!isCreator && !isParticipant && bond.status === 'active' && (
          <JoinBondButton bondId={bond.id} requiredStake={bond.stake_amount || 0} />
        )}
        {(isCreator || isParticipant) && (bond.status === 'active' || bond.status === 'under_review') && (
          <Link
            href={`/bond/${bond.id}/submit`}
            className="inline-flex items-center gap-2 bg-[#00E5A0] text-[#080B0F] font-display font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm shadow-lg shadow-[#00E5A0]/20"
          >
            Submit Proof
          </Link>
        )}
        {isCreator && bond.status === 'under_review' && (
          <BondActions bondId={bond.id} />
        )}
      </div>

      {/* Participants */}
      {bond.bond_participants && bond.bond_participants.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-sm text-zinc-400 uppercase tracking-wider mb-3">Participants</h2>
          <div className="flex flex-wrap gap-2">
            {bond.bond_participants.map((p: any) => (
              <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-sm">
                <div className="w-5 h-5 rounded-full bg-[#00E5A0]/20 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-[#00E5A0]">
                    {(p.profiles?.full_name || 'U')[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-zinc-300">{p.profiles?.full_name || p.profiles?.username || 'User'}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  p.status === 'completed' ? 'text-emerald-400' :
                  p.status === 'failed' ? 'text-red-400' : 'text-zinc-500'
                }`}>{p.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Proof submissions */}
      {proofs && proofs.length > 0 && (
        <section>
          <h2 className="font-display font-semibold text-sm text-zinc-400 uppercase tracking-wider mb-3">Proof Submissions</h2>
          <div className="space-y-3">
            {proofs.map((proof: any) => (
              <div key={proof.id} className="p-4 rounded-xl border border-white/7 bg-[#0D1117]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{proof.profiles?.full_name || 'User'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${proofStatusColor[proof.status] || proofStatusColor.pending}`}>
                    {proof.status}
                  </span>
                </div>
                {proof.content && <p className="text-sm text-zinc-400 mb-2">{proof.content}</p>}
                {proof.link_url && (
                  <a href={proof.link_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#00E5A0] hover:underline">
                    <ExternalLink className="w-3 h-3" /> {proof.link_url}
                  </a>
                )}
                <p className="text-xs text-zinc-600 mt-2">{new Date(proof.submitted_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* On-chain info */}
      {bond.soroban_tx_hash && (
        <div className="p-4 rounded-xl bg-white/3 border border-white/7">
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1.5">On-chain Reference</p>
          <p className="text-xs font-mono text-zinc-400 break-all">{bond.soroban_tx_hash}</p>
          <p className="text-xs text-zinc-600 mt-1">Contract: {bond.soroban_contract_id}</p>
        </div>
      )}
    </div>
  )
}
