import { z } from 'zod'
import { StoreSchemas } from '@/lib/store/schema'
import { RelayUrlSchema } from '../schemas/common'
import { tupleWithOptional } from '../schemas/utilities'

export const RelayListSchema = z.codec(
  z.array(
    z.union([
      tupleWithOptional(
        [
          z.literal('r'),
          RelayUrlSchema,
        ],
        z.union([
          z.literal('read'),
          z.literal('write'),
        ]),
      ),
      z.array(z.string()),
    ]),
  ),
  StoreSchemas.relays,
  {
    decode: (tags) => {
      return tags
        .filter(tag => Array.isArray(tag) && tag[0] === 'r')
        .map((tag) => {
          const [_, url, permission] = tag
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
            return ['r', relay.url]
          }
          return ['r', relay.url, relay.read ? 'read' : 'write']
        })
    },
  },
)
