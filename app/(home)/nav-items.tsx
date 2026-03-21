'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpenIcon, LayoutDashboardIcon } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const allNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboardIcon, librarianOnly: false },
  { href: '/books', label: 'Books', icon: BookOpenIcon, librarianOnly: true },
]

export function NavItems({ isLibrarian }: { isLibrarian: boolean }) {
  const pathname = usePathname()
  const items = allNavItems.filter((item) => !item.librarianOnly || isLibrarian)

  return (
    <SidebarMenu>
      {items.map(({ href, label, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton asChild isActive={pathname === href}>
            <Link href={href}>
              <Icon />
              <span>{label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
