'use client'

import { useRouter } from 'next/navigation'
import { BondStatusBadge } from './BondStatusBadge'
import { formatDate, timeLeft, formatXLM } from '@/lib/utils'
import type { SkillBond } from '@/types'
import { Clock, Users, Lock, GitBranch, ExternalLink } from 'lucide-react'

const PROOF_ICONS: Record<string, React.ReactNode> = {
  github: <GitBranch className="w-3 h-3" />,
  link: <span className="text-[10px]">🔗</span>,
  screenshot: <span className="text-[10px]">📸</span>,
  manual: <span className="text-[10px]">✍️</span>,
}

const CATEGORY_COLORS: Record<string, string> = {
  'Coding': 'text-violet-400',
  'DSA / Algorithms': 'text-blue-400',
  'Web Development': 'text-cyan-400',
  'Blockchain / Web3': 'text-accent',
  'AI / ML': 'text-pink-400',
  'Design': 'text-orange-400',
  default: 'text-zinc-400',
}

export function BondCard({ bond }: { bond: SkillBond }) {
  const router = useRouter()
  const participantCount = bond.bond_participants?.length ?? 0
  const daysLeft = timeLeft(bond.end_date)
  const catColor = CATEGORY_COLORS[bond.category] || CATEGORY_COLORS.default

  const handleCardClick = () => {
    router.push(`/bond/${bond.id}`)
  }

  return (
    <div onClick={handleCardClick} className="group relative rounded-2xl border border-white/7 bg-[#0D1117] p-5 hover:border-accent/30 hover:bg-[#0D1117] transition-all duration-200 cursor-pointer overflow-hidden">
        {/* Hover glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent/3 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold mb-1 ${catColor}`}>{bond.category}</p>
            <h3 className="font-display font-semibold text-sm leading-snug text-zinc-100 line-clamp-2 group-hover:text-white transition-colors">
              {bond.title}
            </h3>
          </div>
          <BondStatusBadge status={bond.status} />
        </div>

        {/* Description */}
        {bond.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
            {bond.description}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Stake */}
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-accent" />
              <span className="text-xs font-bold text-accent">{formatXLM(bond.stake_amount)}</span>
            </div>
            {/* Participants */}
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Users className="w-3 h-3" />
              <span className="text-xs">{participantCount}</span>
            </div>
            {/* Proof type */}
            <div className="flex items-center gap-1 text-zinc-500">
              {PROOF_ICONS[bond.proof_type] || null}
            </div>
          </div>

          {/* Time left */}
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{daysLeft}</span>
          </div>
        </div>

        {/* Creator & Tx */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap">
          {bond.profiles && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center">
                <span className="text-[9px] font-bold text-accent">
                  {(bond.profiles.full_name || 'A')[0].toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-zinc-600">
                {bond.profiles.full_name || bond.profiles.username || 'Anonymous'}
              </span>
            </div>
          )}
          <div className="flex items-center justify-end gap-2 text-xs flex-1">
            {bond.soroban_tx_hash && (
              <a 
                href={`https://stellar.expert/explorer/testnet/tx/${bond.soroban_tx_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                title="View Transaction on Stellar Explorer"
              >
                <ExternalLink className="w-3 h-3 mr-1" /> Explorer
              </a>
            )}
            <span className="text-zinc-700">{formatDate(bond.created_at)}</span>
          </div>
        </div>
      </div>
  )
}
