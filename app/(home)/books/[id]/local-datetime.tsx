'use client'

export function LocalDateTime({ iso }: { iso: string }) {
  return (
    <>
      {new Date(iso).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </>
  )
}
