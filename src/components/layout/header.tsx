'use client'

import * as React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Bell, LogOut, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Breadcrumb } from './breadcrumb'
import { generateInitials } from '@/lib/utils'

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  content_moderator: 'Content Moderator',
  ad_reviewer: 'Ad Reviewer',
  analyst: 'Analyst',
  user: 'User',
}

export function Header() {
  const { data: session } = useSession()
  const userName = session?.user?.name ?? ''
  const userRole = session?.user?.role ?? ''

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <Breadcrumb />

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image ?? undefined} alt={userName} />
                <AvatarFallback className="bg-facebook-100 text-facebook-700 text-xs">
                  {generateInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start text-left md:flex">
                <span className="text-sm font-medium leading-none">{userName}</span>
                <span className="text-xs text-muted-foreground">
                  {roleLabels[userRole] ?? userRole}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
