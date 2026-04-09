'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { joinBond } from '@/actions/bonds'
import { Users, Lock } from 'lucide-react'
import { sorobanService } from '@/lib/soroban'

// Treasury or escrow account to hold XLM
const ESCROW_ADDRESS = 'GCVB4L2OU24RGZQH4YEV3WDKKZS4ATEBFONJFDP7GUWXKQAAQV6P2K2P'

export function JoinBondButton({ bondId, requiredStake }: { bondId: string, requiredStake: number }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleJoin() {
    setLoading(true)
    setError(null)
    
    // 1. Process payment via Freighter first
    if (requiredStake > 0) {
      const txResult = await sorobanService.sendPayment(ESCROW_ADDRESS, requiredStake.toString())
      if (!txResult.success) {
        setError(txResult.error || 'Transaction failed or rejected')
        setLoading(false)
        return
      }
    }

    // 2. Execute DB logic
    const result = await joinBond(bondId)
    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleJoin}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-[#00E5A0] text-[#080B0F] font-display font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm shadow-lg shadow-[#00E5A0]/20 disabled:opacity-50"
      >
        <Lock className="w-4 h-4" />
        {loading ? 'Processing Transaction...' : `Stake ${requiredStake} XLM to Join`}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
