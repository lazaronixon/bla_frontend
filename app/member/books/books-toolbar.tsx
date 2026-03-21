'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { XIcon } from 'lucide-react'

export function BooksToolbar({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter()
  const [value, setValue] = useState(initialQuery ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setValue(q)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      router.replace(`/member/books${params.size ? '?' + params : ''}`)
    }, 300)
  }

  function handleClear() {
    setValue('')
    clearTimeout(debounceRef.current)
    router.replace('/member/books')
  }

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Search by title, author, genre…"
        className="w-64"
      />
      {value && (
        <Button variant="ghost" onClick={handleClear}>
          <XIcon data-icon="inline-start" />
          Clear
        </Button>
      )}
    </div>
  )
}
