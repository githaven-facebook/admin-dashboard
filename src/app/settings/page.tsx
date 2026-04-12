'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const rolePermissions: Record<string, { label: string; permissions: string[] }> = {
  super_admin: {
    label: 'Super Admin',
    permissions: [
      'View all pages',
      'Manage users (suspend, ban, verify)',
      'Assign roles',
      'Moderate content',
      'Review ads',
      'View system health',
      'View audit logs',
      'Manage settings',
    ],
  },
  content_moderator: {
    label: 'Content Moderator',
    permissions: [
      'View dashboard',
      'View & manage users (limited)',
      'Moderate content (approve/reject/escalate)',
      'View analytics',
    ],
  },
  ad_reviewer: {
    label: 'Ad Reviewer',
    permissions: [
      'View dashboard',
      'Review ad campaigns',
      'Approve/reject ads',
      'Flag policy violations',
      'View analytics',
    ],
  },
  analyst: {
    label: 'Analyst',
    permissions: [
      'View dashboard',
      'View analytics (read-only)',
    ],
  },
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>('system')
  const [notifications, setNotifications] = React.useState({
    newReports: true,
    systemAlerts: true,
    adViolations: true,
    weeklyDigest: false,
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Manage your preferences and permissions</p>
            </div>

            <Tabs defaultValue="preferences">
              <TabsList>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="permissions">Role Permissions</TabsTrigger>
              </TabsList>

              <TabsContent value="preferences" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Appearance</CardTitle>
                    <CardDescription>Choose your preferred theme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      {(['light', 'dark', 'system'] as const).map((t) => (
                        <Button
                          key={t}
                          variant={theme === t ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTheme(t)}
                          className="capitalize"
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{session?.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                      </div>
                      <Badge variant="outline">{session?.user?.role?.replace(/_/g, ' ')}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notification Preferences</CardTitle>
                    <CardDescription>Choose what you want to be notified about</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(
                      ([key, enabled]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                          </div>
                          <Button
                            variant={enabled ? 'default' : 'outline'}
                            size="sm"
                            onClick={() =>
                              setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
                            }
                          >
                            {enabled ? 'On' : 'Off'}
                          </Button>
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Role Permissions Matrix</CardTitle>
                    <CardDescription>
                      Overview of what each role can access and do
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(rolePermissions).map(([role, config]) => (
                        <div key={role}>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={role === session?.user?.role ? 'default' : 'outline'}>
                              {config.label}
                            </Badge>
                            {role === session?.user?.role && (
                              <span className="text-xs text-muted-foreground">(your role)</span>
                            )}
                          </div>
                          <ul className="space-y-1 pl-2">
                            {config.permissions.map((perm) => (
                              <li key={perm} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                                {perm}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
