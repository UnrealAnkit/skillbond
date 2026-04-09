'use client'

import { useState } from 'react'
import { submitFeedback } from '@/actions/feedback'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, Star, MessageSquare } from 'lucide-react'

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [text, setText] = useState('')
  const [issueType, setIssueType] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    if (!rating) return
    setLoading(true)
    await submitFeedback({
      rating,
      feedback_text: text,
      issue_type: issueType || undefined,
    })
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center pt-20">
        <div className="w-16 h-16 rounded-2xl bg-[#00E5A0]/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-[#00E5A0]" />
        </div>
        <h2 className="font-display font-bold text-xl mb-2">Thanks for your feedback!</h2>
        <p className="text-zinc-400 text-sm">Your input helps us improve SkillBond for everyone.</p>
      </div>
    )
  }

  const displayRating = hovered || rating

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="font-display font-bold text-2xl tracking-tight flex items-center gap-2.5">
          <MessageSquare className="w-6 h-6 text-[#00E5A0]" />
          Share Feedback
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Help us build a better product</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0D1117] p-6 space-y-6">
        {/* Star rating */}
        <div className="space-y-3">
          <Label>Overall Rating *</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-9 h-9 transition-colors ${
                    n <= displayRating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-zinc-700 hover:text-zinc-500'
                  }`}
                />
              </button>
            ))}
          </div>
          {displayRating > 0 && (
            <p className="text-xs text-zinc-500">
              {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][displayRating]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Feedback Type</Label>
          <Select value={issueType} onValueChange={setIssueType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">🐛 Bug Report</SelectItem>
              <SelectItem value="feature">✨ Feature Request</SelectItem>
              <SelectItem value="ux">🎨 UX / Design</SelectItem>
              <SelectItem value="performance">⚡ Performance</SelectItem>
              <SelectItem value="onboarding">🚀 Onboarding</SelectItem>
              <SelectItem value="general">💬 General Feedback</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback">Your Feedback</Label>
          <Textarea
            id="feedback"
            placeholder="What's working well? What could be better? Any features you'd love to see?"
            className="min-h-[140px]"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading || !rating}
          className="w-full"
          size="lg"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </div>
    </div>
  )
}
