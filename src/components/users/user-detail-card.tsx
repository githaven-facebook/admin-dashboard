import * as React from 'react'
import { CheckCircle, MapPin, Calendar, Users, FileText, AlertTriangle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/status-badge'
import { generateInitials, formatDate, formatNumber } from '@/lib/utils'
import type { User } from '@/types/user'

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  content_moderator: 'Content Moderator',
  ad_reviewer: 'Ad Reviewer',
  analyst: 'Analyst',
  user: 'User',
}

interface UserDetailCardProps {
  user: User
}

export function UserDetailCard({ user }: UserDetailCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-lg">{generateInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold">{user.name}</h2>
              {user.isVerified && (
                <CheckCircle className="h-5 w-5 text-facebook-500" aria-label="Verified account" />
              )}
              <StatusBadge status={user.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">@{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{roleLabels[user.role] ?? user.role}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.bio && (
          <p className="text-sm text-muted-foreground">{user.bio}</p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            icon={Users}
            label="Followers"
            value={formatNumber(user.followerCount, true)}
          />
          <Stat
            icon={Users}
            label="Following"
            value={formatNumber(user.followingCount, true)}
          />
          <Stat
            icon={FileText}
            label="Posts"
            value={formatNumber(user.postCount, true)}
          />
          <Stat
            icon={AlertTriangle}
            label="Reports"
            value={String(user.reportCount)}
            className={user.reportCount > 0 ? 'text-destructive' : undefined}
          />
        </div>

        <div className="grid gap-2 text-sm">
          {user.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{user.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Last active {formatDate(user.lastActiveAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border p-3 text-center">
      <Icon className="h-4 w-4 text-muted-foreground mb-1" />
      <span className={`text-lg font-bold ${className ?? ''}`}>{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
