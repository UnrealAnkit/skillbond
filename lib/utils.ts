import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, differenceInDays, parseISO, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return format(parseISO(date), 'MMM d, yyyy')
}

export function timeLeft(endDate: string): string {
  const days = differenceInDays(parseISO(endDate), new Date())
  if (days < 0) return 'Ended'
  if (days === 0) return 'Last day'
  return `${days}d left`
}

export function formatRelative(date: string) {
  return formatDistanceToNow(parseISO(date), { addSuffix: true })
}

export function formatXLM(amount: number) {
  return `${amount.toLocaleString()} XLM`
}

export const BOND_CATEGORIES = [
  'Coding',
  'DSA / Algorithms',
  'Web Development',
  'Blockchain / Web3',
  'AI / ML',
  'Design',
  'Writing',
  'Language Learning',
  'Fitness',
  'Other',
]

export const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
  active: { label: 'Active', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  completed: { label: 'Completed', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  failed: { label: 'Failed', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  under_review: { label: 'Under Review', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
}
