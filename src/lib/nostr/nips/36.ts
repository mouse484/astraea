import { Schema } from 'effect'

export const ContentWarningTagSchema = Schema.Tuple(
  Schema.Literal('content-warning'),
  Schema.optionalElement(Schema.String),
)
