'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpenIcon, LayoutDashboardIcon } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navItems = [
  { href: '/librarian', label: 'Dashboard', icon: LayoutDashboardIcon },
  { href: '/librarian/books', label: 'Books', icon: BookOpenIcon },
]

export function NavItems() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {navItems.map(({ href, label, icon: Icon }) => (
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
