'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateBondStatus } from '@/actions/bonds'
import { CheckCircle2, XCircle } from 'lucide-react'

export function BondActions({ bondId }: { bondId: string }) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function settle(status: 'completed' | 'failed') {
    setLoading(status)
    await updateBondStatus(bondId, status)
    router.refresh()
    setLoading(null)
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={() => settle('completed')}
        disabled={!!loading}
        className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-500/25 transition-all text-sm disabled:opacity-50"
      >
        <CheckCircle2 className="w-4 h-4" />
        {loading === 'completed' ? 'Settling...' : 'Mark Completed'}
      </button>
      <button
        onClick={() => settle('failed')}
        disabled={!!loading}
        className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 font-semibold px-5 py-2.5 rounded-xl hover:bg-red-500/20 transition-all text-sm disabled:opacity-50"
      >
        <XCircle className="w-4 h-4" />
        {loading === 'failed' ? 'Settling...' : 'Mark Failed'}
      </button>
    </div>
  )
}
