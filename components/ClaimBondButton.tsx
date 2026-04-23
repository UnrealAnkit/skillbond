'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { sorobanService } from '@/lib/soroban'
import { claimBondAction } from '@/actions/bonds'
import { Loader2 } from 'lucide-react'

interface ClaimBondButtonProps {
  bondId: string
  amount: number
}

export function ClaimBondButton({ bondId, amount }: ClaimBondButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleClaim = async () => {
    try {
      setLoading(true)
      setError('')

      // Call soroban contract function
      const res = await sorobanService.settleBond(bondId, 'completed')

      if (!res.success || !res.txHash) {
        throw new Error(res.error || 'Failed to execute transaction')
      }

      // Update database status
      await claimBondAction(bondId, res.txHash)

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Button variant="secondary" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" disabled>
        Claimed Successfully
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button 
          onClick={handleClaim} 
          disabled={loading}
          className="bg-[#00E5A0] text-[#080B0F] font-bold hover:opacity-90 transition-opacity"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Claim your {amount} XLM
        </Button>
        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-sm">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Gas Sponsored
        </span>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}