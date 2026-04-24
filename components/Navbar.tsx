'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/ui/button'
import { WalletConnect } from '@/components/WalletConnect'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Compass, Plus, MessageSquare, LogOut } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/create', label: 'Create Bond', icon: Plus },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile } = useUser()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/7 bg-[#080B0F]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center flex-shrink-0">
          <Image src="/skillbonglogosvg.svg" alt="SkillBond Logo" width={220} height={72} className="h-11 w-auto sm:h-12 object-contain" unoptimized priority />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                pathname === href
                  ? 'bg-accent/10 text-accent'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </div>

        {/* Right: wallet + user + signout */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {user && <WalletConnect />}
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/5 border border-white/7 flex-shrink-0">
              <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold text-accent">
                  {(profile?.full_name || profile?.wallet_address || user.email || 'W')[0].toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-zinc-300 truncate max-w-[90px]">
                {profile?.full_name || profile?.wallet_address?.slice(0, 6) + '...' || user.email?.split('@')[0]}
              </span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out" className="flex-shrink-0 w-8 h-8">
            <LogOut className="w-4 h-4 text-zinc-500" />
          </Button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/7 bg-[#080B0F]/95 backdrop-blur-xl">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all',
                pathname === href ? 'text-accent' : 'text-zinc-500'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
