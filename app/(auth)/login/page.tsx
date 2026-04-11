'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { WalletConnect } from '@/components/WalletConnect'
import { Zap } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()

  function handleConnected() {
    // Use window.location.href to ensure a full page reload so Next.js server components 
    // receive the newly set Supabase auth cookies and don't bounce us back to login.
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-[#080B0F] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#00E5A0] flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-[#080B0F]" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">SkillBond</span>
        </Link>
        <h1 className="text-2xl font-bold mb-2">Connect Wallet</h1>
        <p className="text-zinc-400 mb-8">Access your account or create a new one securely with Web3.</p>
        
        <div className="bg-[#0D1117] border border-white/10 rounded-2xl p-8 shadow-xl flex justify-center">
          <WalletConnect onConnected={handleConnected} />
        </div>
      </div>
    </div>
  )
}
