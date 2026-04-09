'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBond } from '@/actions/bonds'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BOND_CATEGORIES } from '@/lib/utils'
import { Lock, AlertCircle } from 'lucide-react'

export default function CreateBondPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '', description: '', category: '', stake_amount: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '', proof_type: 'manual', visibility: 'public',
  })

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    if (!form.title || !form.category || !form.stake_amount || !form.start_date || !form.end_date) {
      setError('Please fill in all required fields'); return
    }
    if (new Date(form.end_date) <= new Date(form.start_date)) {
      setError('End date must be after start date'); return
    }
    setLoading(true)
    setError(null)
    const result = await createBond({
      title: form.title,
      description: form.description,
      category: form.category,
      stake_amount: parseFloat(form.stake_amount),
      start_date: form.start_date,
      end_date: form.end_date,
      proof_type: form.proof_type as any,
      visibility: form.visibility as any,
    })
    if (result.error) { setError(result.error); setLoading(false); return }
    router.push(`/bond/${result.data?.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display font-bold text-2xl tracking-tight">Create a SkillBond</h1>
        <p className="text-zinc-500 text-sm mt-1">Define your challenge and stake your commitment</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0D1117] p-6 space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Bond Title *</Label>
          <Input
            id="title"
            placeholder="e.g. Complete 30 DSA problems in 30 days"
            value={form.title}
            onChange={e => set('title', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            placeholder="What exactly will you do? Be specific about your goal and how you'll prove it..."
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={form.category} onValueChange={v => set('category', v)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {BOND_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stake">Stake Amount (XLM) *</Label>
            <Input
              id="stake"
              type="number"
              min="0"
              step="1"
              placeholder="100"
              value={form.stake_amount}
              onChange={e => set('stake_amount', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start">Start Date *</Label>
            <Input id="start" type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end">End Date *</Label>
            <Input id="end" type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Proof Type</Label>
            <Select value={form.proof_type} onValueChange={v => set('proof_type', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="screenshot">Screenshot</SelectItem>
                <SelectItem value="link">Link / URL</SelectItem>
                <SelectItem value="manual">Manual Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select value={form.visibility} onValueChange={v => set('visibility', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {form.stake_amount && parseFloat(form.stake_amount) > 0 && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#00E5A0]/8 border border-[#00E5A0]/20">
            <Lock className="w-5 h-5 text-[#00E5A0] flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#00E5A0]">{form.stake_amount} XLM will be locked on-chain</p>
              <p className="text-xs text-zinc-500 mt-0.5">Released automatically on verified completion · Slashed on failure</p>
            </div>
          </div>
        )}

        <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
          {loading ? 'Creating bond...' : 'Create SkillBond'}
        </Button>
      </div>
    </div>
  )
}
