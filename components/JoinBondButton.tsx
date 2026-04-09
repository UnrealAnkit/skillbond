'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { joinBond } from '@/actions/bonds'
import { Users } from 'lucide-react'

export function JoinBondButton({ bondId }: { bondId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleJoin() {
    setLoading(true)
    setError(null)
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
        <Users className="w-4 h-4" />
        {loading ? 'Joining...' : 'Join Bond'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
