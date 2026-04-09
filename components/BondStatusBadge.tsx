import { Badge } from '@/components/ui/badge'
import { STATUS_CONFIG } from '@/lib/utils'
import type { BondStatus } from '@/types'

export function BondStatusBadge({ status }: { status: BondStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  )
}
