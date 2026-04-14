'use client'

import { useEffect, useState } from 'react'

export function LiveStats({ initialStats }: { initialStats: any }) {
  const [stats, setStats] = useState(initialStats)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
          setLastUpdated(new Date())
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    const interval = setInterval(fetchStats, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const [timeText, setTimeText] = useState('less than a second ago')

  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)
      if (seconds < 2) {
        setTimeText('less than a second ago')
      } else if (seconds < 60) {
        setTimeText(`${seconds} seconds ago`)
      } else {
        setTimeText('a minute ago')
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [lastUpdated])

  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center gap-2 text-xs font-semibold text-zinc-500 mb-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5A0] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5A0]"></span>
        </span>
        Live Stats • Last updated {timeText}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          [stats.usersCount, 'Total Users'],
          [stats.bondsCount, 'Total Bonds'],
          [stats.completedCount, 'Completed'],
          [stats.activeCount, 'Needs to Be Done']
        ].map(([v, l]) => (
          <div key={l as string} className="text-center p-6 rounded-2xl border border-white/7 bg-[#0D1117] transition-all duration-300">
            <div className="font-display font-bold text-3xl text-[#00E5A0] mb-1">{v as React.ReactNode}</div>
            <div className="text-xs text-zinc-500">{l as string}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
