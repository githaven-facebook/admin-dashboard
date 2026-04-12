'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  Shield,
  Megaphone,
  BarChart3,
  Activity,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  allowedRoles: string[]
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['super_admin', 'content_moderator', 'ad_reviewer', 'analyst'],
  },
  {
    href: '/users',
    label: 'Users',
    icon: Users,
    allowedRoles: ['super_admin', 'content_moderator'],
  },
  {
    href: '/moderation',
    label: 'Moderation',
    icon: Shield,
    allowedRoles: ['super_admin', 'content_moderator'],
  },
  {
    href: '/ads',
    label: 'Ads Review',
    icon: Megaphone,
    allowedRoles: ['super_admin', 'ad_reviewer'],
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart3,
    allowedRoles: ['super_admin', 'analyst', 'content_moderator', 'ad_reviewer'],
  },
  {
    href: '/system',
    label: 'System Health',
    icon: Activity,
    allowedRoles: ['super_admin'],
  },
  {
    href: '/audit',
    label: 'Audit Log',
    icon: FileText,
    allowedRoles: ['super_admin'],
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
    allowedRoles: ['super_admin'],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = React.useState(false)

  const userRole = session?.user?.role ?? ''

  const visibleItems = navItems.filter((item) => item.allowedRoles.includes(userRole))

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-col border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <span className="text-lg font-bold text-facebook-500">Admin Dashboard</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-facebook-500 text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    collapsed && 'justify-center px-2'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border bg-background shadow-sm"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </aside>
  )
}
