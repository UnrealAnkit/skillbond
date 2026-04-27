import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Lock, Zap, Shield, GitBranch, TrendingUp, Award } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { LiveStats } from '@/components/LiveStats'

export default async function LandingPage() {
  const supabase = await createClient()

  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: bondsCount } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true })
  const { count: completedCount } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).eq('status', 'completed')
  const { count: activeCount } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).in('status', ['active', 'under_review'])

  return (
    <div className="min-h-screen bg-[#080B0F] text-zinc-100 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#00E5A0]/5 blur-[120px]" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/4 blur-[100px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/skillbonglogosvg.svg?v=20260427"
            alt="SkillBond Logo"
            width={420}
            height={420}
            className="h-16 w-auto sm:h-[4.5rem]"
            unoptimized
            priority
          />
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold bg-[#00E5A0] text-[#080B0F] px-5 py-2 rounded-xl hover:opacity-90 transition-all">Connect Wallet</Link>
        </div>
      </nav>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00E5A0]/25 bg-[#00E5A0]/8 text-[#00E5A0] text-xs font-semibold mb-8">
          <Zap className="w-3 h-3" /> Built on Stellar · Powered by Soroban
        </div>
        <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight mb-6">
          Stake your goals.<br />
          <span className="text-[#00E5A0]">Prove your growth.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
          SkillBond locks funds in smart contracts tied to verifiable skill milestones. Complete your challenge, unlock your stake. Fail, and the community wins.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="inline-flex items-center gap-2 bg-[#00E5A0] text-[#080B0F] font-display font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all text-base">
            Connect to Create <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/explore" className="inline-flex items-center gap-2 border border-white/10 text-zinc-300 font-semibold px-8 py-3.5 rounded-xl hover:border-white/20 hover:bg-white/5 transition-all text-base">
            Explore active bonds
          </Link>
        </div>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <LiveStats initialStats={{
          usersCount: usersCount || 0,
          bondsCount: bondsCount || 0,
          completedCount: completedCount || 0,
          activeCount: activeCount || 0,
        }} />
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <h2 className="font-display font-bold text-3xl text-center mb-3 tracking-tight">How SkillBond works</h2>
        <p className="text-zinc-500 text-center mb-12 text-sm">Four steps to accountable skill development</p>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            [Lock,'Stake XLM','Lock funds in a Soroban smart contract. Skin in the game.','text-[#00E5A0]'],
            [Shield,'Set conditions','Define your challenge: timeline, proof type, verifiable outcome.','text-blue-400'],
            [GitBranch,'Submit proof','Link GitHub commits, screenshots, or certified completion.','text-violet-400'],
            [TrendingUp,'Get paid or slash','Complete the goal → funds unlock. Fail → redistributed.','text-amber-400'],
          ].map(([Icon, title, desc, color], i) => (
            <div key={String(title)} className="relative p-5 rounded-2xl border border-white/7 bg-[#0D1117] hover:border-white/14 transition-colors">
              <div className="absolute top-4 right-4 text-2xl font-display font-bold text-white/5 select-none">{String(i+1).padStart(2,'0')}</div>
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-sm mb-1.5">{String(title)}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{String(desc)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="p-10 rounded-3xl border border-[#00E5A0]/20 bg-[#00E5A0]/5">
          <Award className="w-10 h-10 text-[#00E5A0] mx-auto mb-4" />
          <h2 className="font-display font-bold text-3xl mb-3 tracking-tight">Ready to commit?</h2>
          <p className="text-zinc-400 text-sm mb-8">Put your XLM where your goals are.</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-[#00E5A0] text-[#080B0F] font-display font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-all">
            Connect to Start <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/7 px-6 py-8 text-center">
        <p className="text-xs text-zinc-600">SkillBond · Built on Stellar Soroban · Hackathon MVP</p>
      </footer>
    </div>
  )
}
