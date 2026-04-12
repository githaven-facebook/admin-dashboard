'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserX, Ban, CheckCircle, Shield, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSuspendUser, useBanUser, useVerifyUser, useAssignRole, useUnsuspendUser, useUnbanUser } from '@/hooks/use-users'
import { suspendUserSchema, banUserSchema, type SuspendUserFormData, type BanUserFormData } from '@/lib/validators'
import type { User } from '@/types/user'

interface UserActionsProps {
  user: User
}

type ActionDialog = 'suspend' | 'ban' | null

export function UserActions({ user }: UserActionsProps) {
  const router = useRouter()
  const [openDialog, setOpenDialog] = React.useState<ActionDialog>(null)
  const [actionFeedback, setActionFeedback] = React.useState<string | null>(null)

  const suspendMutation = useSuspendUser()
  const banMutation = useBanUser()
  const verifyMutation = useVerifyUser()
  const assignRoleMutation = useAssignRole()
  const unsuspendMutation = useUnsuspendUser()
  const unbanMutation = useUnbanUser()

  const suspendForm = useForm<SuspendUserFormData>({
    resolver: zodResolver(suspendUserSchema),
    defaultValues: { notifyUser: true },
  })

  const banForm = useForm<BanUserFormData>({
    resolver: zodResolver(banUserSchema),
    defaultValues: { notifyUser: true, appealable: true },
  })

  function showFeedback(msg: string) {
    setActionFeedback(msg)
    setTimeout(() => setActionFeedback(null), 3000)
  }

  async function handleSuspend(data: SuspendUserFormData) {
    await suspendMutation.mutateAsync({ id: user.id, payload: data })
    setOpenDialog(null)
    showFeedback('User suspended successfully.')
    router.refresh()
  }

  async function handleBan(data: BanUserFormData) {
    await banMutation.mutateAsync({ id: user.id, payload: data })
    setOpenDialog(null)
    showFeedback('User banned successfully.')
    router.refresh()
  }

  async function handleVerify() {
    await verifyMutation.mutateAsync(user.id)
    showFeedback('User verified successfully.')
    router.refresh()
  }

  async function handleUnsuspend() {
    await unsuspendMutation.mutateAsync(user.id)
    showFeedback('User unsuspended successfully.')
    router.refresh()
  }

  async function handleUnban() {
    await unbanMutation.mutateAsync(user.id)
    showFeedback('User unbanned successfully.')
    router.refresh()
  }

  async function handleRoleChange(role: User['role']) {
    await assignRoleMutation.mutateAsync({ id: user.id, role })
    showFeedback(`Role updated to ${role}.`)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Account Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actionFeedback && (
          <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
            {actionFeedback}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Assign Role</label>
          <Select
            value={user.role}
            onValueChange={(v) => handleRoleChange(v as User['role'])}
            disabled={assignRoleMutation.isPending}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
              <SelectItem value="ad_reviewer">Ad Reviewer</SelectItem>
              <SelectItem value="content_moderator">Content Moderator</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {!user.isVerified && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleVerify}
              disabled={verifyMutation.isPending}
              className="gap-1.5"
            >
              <Shield className="h-3.5 w-3.5" />
              Verify
            </Button>
          )}

          {user.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenDialog('suspend')}
              className="gap-1.5 text-yellow-600 hover:text-yellow-600"
            >
              <UserX className="h-3.5 w-3.5" />
              Suspend
            </Button>
          )}

          {user.status === 'suspended' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleUnsuspend}
              disabled={unsuspendMutation.isPending}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Unsuspend
            </Button>
          )}

          {user.status !== 'banned' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenDialog('ban')}
              className="gap-1.5 text-destructive hover:text-destructive"
            >
              <Ban className="h-3.5 w-3.5" />
              Ban
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleUnban}
              disabled={unbanMutation.isPending}
              className="gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Unban
            </Button>
          )}
        </div>
      </CardContent>

      {/* Suspend dialog */}
      <Dialog open={openDialog === 'suspend'} onOpenChange={(o) => !o && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Suspend <strong>{user.name}</strong>. They will not be able to access the platform.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={suspendForm.handleSubmit(handleSuspend)} className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Reason *</label>
              <Input
                placeholder="Provide a detailed reason…"
                {...suspendForm.register('reason')}
              />
              {suspendForm.formState.errors.reason && (
                <p className="text-xs text-destructive">
                  {suspendForm.formState.errors.reason.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Duration (days, leave blank for indefinite)</label>
              <Input
                type="number"
                placeholder="e.g. 7"
                {...suspendForm.register('durationDays', { valueAsNumber: true })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDialog(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={suspendMutation.isPending}
              >
                {suspendMutation.isPending ? 'Suspending…' : 'Suspend User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ban dialog */}
      <Dialog open={openDialog === 'ban'} onOpenChange={(o) => !o && setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
            <DialogDescription>
              Permanently ban <strong>{user.name}</strong>. This action is severe.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={banForm.handleSubmit(handleBan)} className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Reason *</label>
              <Input
                placeholder="Provide a detailed reason…"
                {...banForm.register('reason')}
              />
              {banForm.formState.errors.reason && (
                <p className="text-xs text-destructive">
                  {banForm.formState.errors.reason.message}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenDialog(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={banMutation.isPending}
              >
                {banMutation.isPending ? 'Banning…' : 'Ban User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
