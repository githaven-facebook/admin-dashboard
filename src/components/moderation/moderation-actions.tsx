'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, XCircle, ArrowUpCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useModerateContent } from '@/hooks/use-moderation'
import { moderationActionSchema, type ModerationActionFormData } from '@/lib/validators'
import type { ContentReport } from '@/types/moderation'

interface ModerationActionsProps {
  report: ContentReport
}

export function ModerationActions({ report }: ModerationActionsProps) {
  const router = useRouter()
  const moderateMutation = useModerateContent()
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ModerationActionFormData>({
    resolver: zodResolver(moderationActionSchema),
    defaultValues: { action: 'approve' },
  })

  const selectedAction = watch('action')

  async function onSubmit(data: ModerationActionFormData) {
    try {
      await moderateMutation.mutateAsync({
        id: report.id,
        action: data.action,
        payload: { reason: data.reason, note: data.note },
      })
      setFeedback({ type: 'success', msg: `Content ${data.action}d successfully.` })
      setTimeout(() => router.push('/moderation'), 1500)
    } catch {
      setFeedback({ type: 'error', msg: 'Action failed. Please try again.' })
    }
  }

  const isResolved = ['approved', 'rejected', 'escalated'].includes(report.status)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Moderation Decision</CardTitle>
      </CardHeader>
      <CardContent>
        {feedback && (
          <div
            className={`mb-4 rounded-md px-3 py-2 text-sm ${
              feedback.type === 'success'
                ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {feedback.msg}
          </div>
        )}

        {isResolved ? (
          <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
            This report has already been resolved.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Decision</label>
              <Select
                value={selectedAction}
                onValueChange={(v) =>
                  setValue('action', v as ModerationActionFormData['action'])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Approve (no action needed)
                    </div>
                  </SelectItem>
                  <SelectItem value="reject">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Reject (remove content)
                    </div>
                  </SelectItem>
                  <SelectItem value="escalate">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle className="h-4 w-4 text-purple-500" />
                      Escalate to senior review
                    </div>
                  </SelectItem>
                  <SelectItem value="remove">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-destructive" />
                      Remove immediately
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Reason *</label>
              <Input placeholder="Explain your decision…" {...register('reason')} />
              {errors.reason && (
                <p className="text-xs text-destructive">{errors.reason.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Internal Note (optional)</label>
              <Input placeholder="Additional context for the team…" {...register('note')} />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/moderation')}
                className="flex-1"
              >
                Back to Queue
              </Button>
              <Button
                type="submit"
                disabled={moderateMutation.isPending}
                className="flex-1"
                variant={
                  selectedAction === 'reject' || selectedAction === 'remove'
                    ? 'destructive'
                    : 'default'
                }
              >
                {moderateMutation.isPending ? 'Submitting…' : 'Submit Decision'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
