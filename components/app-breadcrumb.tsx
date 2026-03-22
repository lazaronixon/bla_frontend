"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const SEGMENT_LABELS: Record<string, string> = {
  member: "Member",
  librarian: "Librarian",
  books: "Books",
  new: "New Book",
}

function labelFor(segment: string) {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment]
  if (/^\d+$/.test(segment)) return `#${segment}`
  return segment
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) return null

  const crumbs = segments.map((segment, index) => ({
    label: labelFor(segment),
    href: "/" + segments.slice(0, index + 1).join("/"),
  }))

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
