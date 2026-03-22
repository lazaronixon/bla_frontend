'use client'

import { TriangleAlertIcon, CircleCheckIcon } from 'lucide-react'
import { formatLocalDateTime } from '@/lib/utils'

export function DueCell({ dueAt }: { dueAt: string }) {
  const now = new Date()
  const overdue = new Date(dueAt) < now
  return (
    <span className="flex items-center justify-end gap-1">
      {overdue && <TriangleAlertIcon className="size-4 text-red-500" />}
      {!overdue && <CircleCheckIcon className="size-4 text-green-500" />}
      {formatLocalDateTime(dueAt)}
    </span>
  )
}
