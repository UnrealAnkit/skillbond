'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, ArrowLeft, CheckCircle2, Upload } from 'lucide-react'
import Link from 'next/link'

export default function SubmitProofPage() {
  const params = useParams()
  const router = useRouter()
  const bondId = params.id as string
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [content, setContent] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)

  async function handleSubmit() {
    if (!content && !linkUrl && !file) {
      setError('Please provide at least one form of proof'); return
    }
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not authenticated'); setLoading(false); return }

    let fileUrl: string | null = null
    if (file) {
      const { data: up, error: upErr } = await supabase.storage
        .from('proofs')
        .upload(`${user.id}/${bondId}/${Date.now()}_${file.name}`, file)
      if (upErr) { setError(upErr.message); setLoading(false); return }
      fileUrl = up.path
    }

    const proofType = file ? 'screenshot' : linkUrl ? 'link' : 'manual'

    const { error: insertErr } = await supabase.from('proof_submissions').insert({
      bond_id: bondId,
      submitter_id: user.id,
      proof_type: proofType,
      content: content || null,
      link_url: linkUrl || null,
      file_url: fileUrl,
      status: 'pending',
    })

    if (insertErr) { setError(insertErr.message); setLoading(false); return }

    await supabase
      .from('skill_bonds')
      .update({ status: 'under_review', updated_at: new Date().toISOString() })
      .eq('id', bondId)

    setSuccess(true)
    setLoading(false)
    setTimeout(() => router.push(`/bond/${bondId}`), 2000)
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center pt-20">
        <div className="w-16 h-16 rounded-2xl bg-[#00E5A0]/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-[#00E5A0]" />
        </div>
        <h2 className="font-display font-bold text-xl mb-2">Proof submitted!</h2>
        <p className="text-zinc-400 text-sm">Your bond is now under review. Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link href={`/bond/${bondId}`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-100 text-sm transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to bond
      </Link>

      <div>
        <h1 className="font-display font-bold text-2xl tracking-tight">Submit Proof</h1>
        <p className="text-zinc-500 text-sm mt-1">Show that you completed your challenge</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0D1117] p-6 space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="content">Description / Notes</Label>
          <Textarea
            id="content"
            placeholder="Describe what you accomplished, what you learned, and how you met the challenge criteria..."
            className="min-h-[120px]"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="link">Link Proof (GitHub, Loom, Certificate URL)</Label>
          <Input
            id="link"
            type="url"
            placeholder="https://github.com/you/repo or https://..."
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>File Upload</Label>
          <label className="flex flex-col items-center gap-3 p-5 rounded-xl border border-dashed border-white/15 bg-white/3 hover:border-[#00E5A0]/30 hover:bg-[#00E5A0]/4 transition-all cursor-pointer group">
            <Upload className="w-6 h-6 text-zinc-600 group-hover:text-[#00E5A0] transition-colors" />
            <div className="text-center">
              <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {file ? file.name : 'Click to upload screenshot or PDF'}
              </p>
              <p className="text-xs text-zinc-600 mt-1">PNG, JPG, PDF up to 10MB</p>
            </div>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading || (!content && !linkUrl && !file)}
          className="w-full"
          size="lg"
        >
          {loading ? 'Submitting...' : 'Submit Proof'}
        </Button>

        <p className="text-xs text-zinc-600 text-center">
          After submission, your bond will be marked as "Under Review"
        </p>
      </div>
    </div>
  )
}
