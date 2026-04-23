'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { WalletConnect } from '@/components/WalletConnect'

export default function LoginPage() {
  const router = useRouter()

  function handleConnected() {
    
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-[#080B0F] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 group mb-4">
          <Image
            src="/logo.png"
            alt="SkillBond Logo"
            width={320}
            height={160}
            className="h-12 w-auto sm:h-14"
            priority
          />
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
