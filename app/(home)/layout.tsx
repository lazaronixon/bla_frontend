import { LibraryIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'
import { getSession } from '@/lib/session'
import { BACKEND_URL } from '@/lib/config'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { NavItems } from './nav-items'

async function getCurrentUser() {
  const token = await getSession()
  if (!token) return null
  const res = await fetch(`${BACKEND_URL}/my/user`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  if (!res.ok) return null
  return res.json()
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <SidebarProvider className="h-svh">
      <Sidebar collapsible="none">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <LibraryIcon className="size-5" />
            <span className="font-semibold tracking-tight">BLA Library</span>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <NavItems isLibrarian={user?.role === 'librarian'} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <form action={signOut}>
            <Button variant="destructive" size="sm" className="w-full">
              Sign out
            </Button>
          </form>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
