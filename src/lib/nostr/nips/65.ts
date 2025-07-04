import { Schema } from 'effect'
import { StoreSchemas } from '@/lib/store/schema'
import { RelayUrlSchema } from '../schemas/common'

export const RelayListSchema = Schema.transform(
  Schema.Array(
    Schema.Union(
      Schema.Tuple(
        Schema.Literal('r'),
        RelayUrlSchema,
        Schema.optionalElement(
          Schema.Union(
            Schema.Literal('read'),
            Schema.Literal('write'),
          ),
        ),
      ),
      Schema.Array(Schema.String),
    ),
  ),
  StoreSchemas.relays,
  {
    strict: true,
    decode: (tags) => {
      return tags
        .filter(([tagName]) => tagName === 'r')
        .map(([_, url, permission]) => {
          return {
            url,
            read: permission === 'read' || permission === undefined,
            write: permission === 'write' || permission === undefined,
          }
        })
    },
    encode: (relays) => {
      return relays
        .filter(relay => relay.read || relay.write)
        .map((relay) => {
          if (relay.read && relay.write) {
            return ['r', relay.url] as const
          }
          return ['r', relay.url, relay.read ? 'read' : 'write'] as const
        })
    },
  },
)
