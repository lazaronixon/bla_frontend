import Link from 'next/link'
import { BookOpenIcon, LayoutDashboardIcon, LibraryIcon } from 'lucide-react'
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from '@/components/ui/sidebar'

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
  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboardIcon },
    ...(user?.role === 'librarian'
      ? [{ href: '/books', label: 'Books', icon: BookOpenIcon }]
      : []),
  ]

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
              <SidebarMenu>
                {navItems.map(({ href, label, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild>
                      <Link href={href}>
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
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
