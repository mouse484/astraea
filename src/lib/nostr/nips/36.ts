import * as z from 'zod'
import { tupleWithOptional } from '../schemas/utilities'

export const ContentWarningTagSchema = tupleWithOptional(
  [
    z.literal('content-warning'),
  ],
  z.string().trim(),
)
