import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Lock, Zap, Shield, GitBranch, TrendingUp, Award } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { LiveStats } from '@/components/LiveStats'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { FadeIn } from '@/components/FadeIn'

export default async function LandingPage() {
  const supabase = await createClient()

  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: bondsCount } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true })
  const { count: completedCount } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).eq('status', 'completed')
  const { count: activeCount } = await supabase.from('skill_bonds').select('*', { count: 'exact', head: true }).in('status', ['active', 'under_review'])

  return (
    <div className="min-h-screen bg-[#080B0F] text-zinc-100 overflow-x-hidden selection:bg-[#00E5A0]/30">
      <AnimatedBackground />

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
        <FadeIn delay={0.1}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00E5A0]/25 bg-[#00E5A0]/8 text-[#00E5A0] text-xs font-semibold mb-8 backdrop-blur-sm">
            <Zap className="w-3 h-3" /> Built on Stellar · Powered by Soroban
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-tight mb-6">
            Stake your goals.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5A0] to-blue-400">Prove your growth.</span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            SkillBond locks funds in smart contracts tied to verifiable skill milestones. Complete your challenge, unlock your stake. Fail, and the community wins.
          </p>
        </FadeIn>
        
        <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#00E5A0] to-emerald-400 text-[#080B0F] font-display font-bold px-8 py-3.5 rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-300 text-base shadow-[0_0_30px_-5px_#00E5A0]">
            Connect to Create <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/explore" className="inline-flex items-center justify-center gap-2 border border-white/10 text-zinc-300 font-semibold px-8 py-3.5 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all duration-300 text-base backdrop-blur-sm">
            Explore active bonds
          </Link>
        </FadeIn>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <FadeIn delay={0.5}>
          <LiveStats initialStats={{
            usersCount: usersCount || 0,
            bondsCount: bondsCount || 0,
            completedCount: completedCount || 0,
            activeCount: activeCount || 0,
          }} />
        </FadeIn>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <FadeIn direction="up">
          <h2 className="font-display font-bold text-3xl text-center mb-3 tracking-tight">How SkillBond works</h2>
          <p className="text-zinc-500 text-center mb-12 text-sm">Four steps to accountable skill development</p>
        </FadeIn>
        
        <div className="grid md:grid-cols-4 gap-4">
          {[
            [Lock,'Stake XLM','Lock funds in a Soroban smart contract. Skin in the game.','text-[#00E5A0]'],
            [Shield,'Set conditions','Define your challenge: timeline, proof type, verifiable outcome.','text-blue-400'],
            [GitBranch,'Submit proof','Link GitHub commits, screenshots, or certified completion.','text-violet-400'],
            [TrendingUp,'Get paid or slash','Complete the goal → funds unlock. Fail → redistributed.','text-amber-400'],
          ].map(([Icon, title, desc, color], i) => (
            <FadeIn key={String(title)} delay={0.1 * i} direction="up" className="h-full">
              <div className="relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 h-full backdrop-blur-sm group hover:-translate-y-1">
                <div className="absolute top-4 right-4 text-3xl font-display font-bold text-white/[0.02] group-hover:text-white/10 transition-colors select-none">{String(i+1).padStart(2,'0')}</div>
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 ${color} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-base mb-2 group-hover:text-white transition-colors">{String(title)}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">{String(desc)}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <FadeIn direction="up" delay={0.2}>
          <div className="p-12 rounded-[2rem] border border-[#00E5A0]/20 bg-gradient-to-b from-[#00E5A0]/10 to-transparent backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-1 bg-gradient-to-r from-transparent via-[#00E5A0] to-transparent opacity-50" />
            <Award className="w-12 h-12 text-[#00E5A0] mx-auto mb-6" />
            <h2 className="font-display font-bold text-4xl mb-4 tracking-tight">Ready to commit?</h2>
            <p className="text-zinc-400 text-base mb-10">Put your XLM where your goals are.</p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-[#00E5A0] text-[#080B0F] font-display font-bold px-8 py-4 rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_#00E5A0]">
              Connect to Start <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </FadeIn>
      </section>

      <footer className="relative z-10 border-t border-white/7 px-6 py-8 text-center">
        <p className="text-xs text-zinc-600">SkillBond · Built on Stellar Soroban · Hackathon MVP</p>
      </footer>
    </div>
  )
}
