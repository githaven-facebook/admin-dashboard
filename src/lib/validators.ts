import { z } from 'zod'

export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  role: z
    .enum(['super_admin', 'content_moderator', 'ad_reviewer', 'analyst', 'user'])
    .optional(),
  status: z
    .enum(['active', 'suspended', 'banned', 'pending_verification', 'deactivated'])
    .optional(),
  isVerified: z.boolean().optional(),
})

export const suspendUserSchema = z.object({
  reason: z.string().min(10, 'Please provide a detailed reason (min 10 characters)').max(500),
  durationDays: z.number().int().positive().max(365).optional(),
  notifyUser: z.boolean().default(true),
})

export const banUserSchema = z.object({
  reason: z.string().min(10, 'Please provide a detailed reason (min 10 characters)').max(500),
  notifyUser: z.boolean().default(true),
  appealable: z.boolean().default(true),
})

export const moderationActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'escalate', 'remove']),
  reason: z.string().min(1, 'Reason is required').max(500),
  note: z.string().max(1000).optional(),
})

export const bulkModerationSchema = z.object({
  reportIds: z.array(z.string()).min(1, 'Select at least one item'),
  action: z.enum(['approve', 'reject', 'escalate', 'remove']),
  reason: z.string().min(1, 'Reason is required').max(500),
  note: z.string().max(1000).optional(),
})

export const adReviewSchema = z.object({
  action: z.enum(['approve', 'reject', 'flag']),
  reason: z.string().max(500).optional(),
  policyViolations: z
    .array(
      z.enum([
        'misleading_content',
        'prohibited_products',
        'targeting_violation',
        'image_violation',
        'text_violation',
        'landing_page_violation',
        'other',
      ])
    )
    .optional(),
  note: z.string().max(1000).optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
})

export type UserUpdateFormData = z.infer<typeof userUpdateSchema>
export type SuspendUserFormData = z.infer<typeof suspendUserSchema>
export type BanUserFormData = z.infer<typeof banUserSchema>
export type ModerationActionFormData = z.infer<typeof moderationActionSchema>
export type BulkModerationFormData = z.infer<typeof bulkModerationSchema>
export type AdReviewFormData = z.infer<typeof adReviewSchema>
export type LoginFormData = z.infer<typeof loginSchema>
