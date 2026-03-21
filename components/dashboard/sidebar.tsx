import Link from 'next/link'
import { BookOpenIcon, LayoutDashboardIcon, LibraryIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { signOut } from '@/app/actions/auth'
import { getSession } from '@/lib/session'
import { BACKEND_URL } from '@/lib/config'

async function getCurrentUser() {
  const token = await getSession()
  if (!token) return null
  const res = await fetch(`${BACKEND_URL}/my/user`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  if (!res.ok) return null
  return res.json()
}

export async function Sidebar() {
  const user = await getCurrentUser()
  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboardIcon },
    ...(user?.role === 'librarian'
      ? [{ href: '/books', label: 'Books', icon: BookOpenIcon }]
      : []),
  ]

  return (
    <aside className="flex flex-col w-56 shrink-0 border-r bg-card px-3 py-4">
      <div className="flex items-center gap-2 px-2 py-1 mb-4">
        <LibraryIcon className="size-5" />
        <span className="font-semibold tracking-tight">BLA Library</span>
      </div>
      <Separator className="mb-4" />
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
      <Separator className="mb-4" />
      <form action={signOut}>
        <Button variant="destructive" size="sm" className="w-full">
          Sign out
        </Button>
      </form>
    </aside>
  )
}
