import { z } from 'zod'

export const ContentWarningTagSchema = z.tuple([
  z.literal('content-warning'),
  z.string().optional(),
])
