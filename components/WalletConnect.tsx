'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Wallet, Check } from 'lucide-react'
import { isConnected, getPublicKey } from '@stellar/freighter-api'

interface WalletConnectProps {
  onConnected?: (address: string) => void
}

export function WalletConnect({ onConnected }: WalletConnectProps) {
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // We rely on @stellar/freighter-api's isConnected() method now.
    // So we don't need manual interval checks.
  }, [])

  async function handleConnect() {
    setError(null)
    setLoading(true)

    try {
      const currentHost = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      const connected = await isConnected()

      if (!connected) {
        throw new Error(
          'Freighter wallet not detected or not allowed.\n\n' +
          '1. Install from: https://freighter.app\n' +
          `2. In Freighter Settings → Whitelist, make sure to add:\n   ${currentHost}\n`
        )
      }

      console.log('Connecting to Freighter...')
      const publicKey = await getPublicKey()
      console.log('Got public key:', publicKey)

      if (!publicKey) {
        throw new Error('Failed to get public key from Freighter')
      }

      setAddress(publicKey)

      // Save to profile
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        try {
          await supabase.from('profiles')
            .update({ wallet_address: publicKey })
            .eq('id', user.id)
        } catch (e: any) {
          console.log('Profile update skipped:', e.message)
        }
      }

      console.log('Wallet connected successfully:', publicKey)
      onConnected?.(publicKey)
    } catch (error: any) {
      let errorMsg = error?.message || 'Failed to connect wallet'
      const currentHost = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      
      // Better error messages for common issues
      if (errorMsg.includes('Origin not allowed')) {
        errorMsg = 'Freighter blocked this origin.\n\n' +
          `Fix: Add ${currentHost} to Freighter → Settings → Whitelist`
      } else if (errorMsg.includes('User rejected the request')) {
        errorMsg = 'You rejected the wallet connection request'
      }
      
      console.error('Wallet connection error:', errorMsg)
      setError(errorMsg)
      alert(`⚠ Wallet Error:\n\n${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  if (address) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-accent/10 border border-accent/20 whitespace-nowrap">
        <Check className="w-3 h-3 text-accent flex-shrink-0" />
        <span className="text-xs font-mono text-accent truncate">
          {address.slice(0, 5)}...{address.slice(-4)}
        </span>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={loading}
      variant="secondary"
      size="sm"
      className="text-xs px-2 h-8 whitespace-nowrap"
      title="Click to connect your Freighter wallet"
    >
      <Wallet className="w-3 h-3 flex-shrink-0" />
      <span className="hidden sm:inline">{loading ? 'Connecting...' : 'Wallet'}</span>
      <span className="sm:hidden">{loading ? '...' : 'W'}</span>
    </Button>
  )
}
