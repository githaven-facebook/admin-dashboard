'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const routeLabels: Record<string, string> = {
  users: 'Users',
  moderation: 'Moderation',
  ads: 'Ads Review',
  analytics: 'Analytics',
  system: 'System Health',
  audit: 'Audit Log',
  settings: 'Settings',
  login: 'Login',
}

export function Breadcrumb() {
  const pathname = usePathname()

  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return (
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
        <Home className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Dashboard</span>
      </nav>
    )
  }

  const crumbs = segments.map((seg, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = routeLabels[seg] ?? seg
    const isLast = index === segments.length - 1
    return { href, label, isLast }
  })

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {crumbs.map((crumb) => (
        <React.Fragment key={crumb.href}>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {crumb.isLast ? (
            <span className={cn('font-medium')}>{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
