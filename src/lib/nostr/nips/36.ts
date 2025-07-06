import { Schema } from 'effect'

export const ContentWarningTagScema = Schema.Tuple(
  Schema.Literal('content-warning'),
  Schema.optionalElement(Schema.String),
)
