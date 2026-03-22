'use client'

import { TriangleAlertIcon, CircleCheckIcon } from 'lucide-react'
import { formatLocalDateTime } from '@/lib/utils'

export function DueCell({ dueAt }: { dueAt: string }) {
  const now = new Date()
  const overdue = new Date(dueAt) < now
  return (
    <span className="flex items-center gap-1">
      {overdue && <TriangleAlertIcon className="size-4 text-muted-foreground" />}
      {!overdue && <CircleCheckIcon className="size-4 text-muted-foreground" />}
      {formatLocalDateTime(dueAt)}
    </span>
  )
}
