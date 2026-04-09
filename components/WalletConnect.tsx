'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Wallet, Check } from 'lucide-react'

interface WalletConnectProps {
  onConnected?: (address: string) => void
}

declare global {
  interface Window {
    freighter?: {
      getPublicKey: () => Promise<string>
      getNetwork: () => Promise<any>
      isConnected: () => Promise<boolean>
      signTransaction: (xdr: string, passphrase: string) => Promise<any>
    }
  }
}

export function WalletConnect({ onConnected }: WalletConnectProps) {
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [freighterAvailable, setFreighterAvailable] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Simple check - just see if window.freighter exists
    const checkFreighter = () => {
      const available = typeof window !== 'undefined' && !!window.freighter
      setFreighterAvailable(available)
      console.log('Freighter available:', available)
    }

    // Check on mount
    checkFreighter()

    // Check again in case extension loads late
    const t1 = setTimeout(checkFreighter, 1000)
    const t2 = setTimeout(checkFreighter, 2500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  async function handleConnect() {
    setLoading(true)

    try {
      if (typeof window === 'undefined' || !window.freighter) {
        console.error('Freighter not available')
        setFreighterAvailable(false)
        setLoading(false)
        return
      }

      console.log('Getting public key from Freighter...')
      const publicKey = await window.freighter.getPublicKey()
      console.log('Got public key:', publicKey)

      if (!publicKey) {
        console.error('No public key returned')
        setLoading(false)
        return
      }

      setAddress(publicKey)

      // Save to profile
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles')
          .update({ wallet_address: publicKey })
          .eq('id', user.id)
          .catch(e => console.log('Profile update skipped:', e.message))
      }

      onConnected?.(publicKey)
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      setFreighterAvailable(false)
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
      disabled={loading || !freighterAvailable}
      variant="secondary"
      size="sm"
      className="text-xs px-2 h-8 whitespace-nowrap"
      title={!freighterAvailable ? 'Install Freighter from freighter.app' : 'Connect wallet'}
    >
      <Wallet className="w-3 h-3 flex-shrink-0" />
      <span className="hidden sm:inline">{loading ? 'Connecting...' : 'Wallet'}</span>
      <span className="sm:hidden">{loading ? '...' : 'W'}</span>
    </Button>
  )
}
