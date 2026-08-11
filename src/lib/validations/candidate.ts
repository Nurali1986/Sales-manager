import { z } from 'zod'

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(9, 'Phone number must be valid'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  city: z.string().optional().or(z.literal(''))
})

export const testSubmissionSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    answer: z.string()
  }))
})

export const caseSubmissionSchema = z.object({
  content: z.string().min(10, 'Case response is too short').max(10000, 'Case response is too long')
})

export const scriptSubmissionSchema = z.object({
  content: z.string().min(10, 'Script is too short').max(15000, 'Script is too long')
})

export const fileUploadUrlSchema = z.object({
  fileName: z.string(),
  mimeType: z.string(),
  fileSize: z.number().positive().max(100 * 1024 * 1024, 'File exceeds 100MB maximum')
})

export const fileSubmissionSchema = z.object({
  storageKey: z.string(),
  originalFileName: z.string(),
  mimeType: z.string(),
  fileSize: z.number().positive().max(100 * 1024 * 1024, 'File exceeds 100MB maximum')
})
