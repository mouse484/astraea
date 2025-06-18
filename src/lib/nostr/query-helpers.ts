import type { Filter } from 'nostr-tools'
import type { RouterContext } from '@/main'
import { queryOptions } from '@tanstack/react-query'
import { Schema } from 'effect'

export interface NostrQueryContext extends Pick<RouterContext, 'pool'> {
  relays: string[]
}

export interface QueryConfig<T, I = T> {
  name: string
  schema: Schema.Schema<T, I>
  kind: number
}

export function createQuery<T, I = T>({ name, schema, kind }: QueryConfig<T, I>) {
  return ({ pool, relays }: NostrQueryContext, filter: Omit<Filter, 'kinds'>) => {
    const fullFilter = { ...filter, kinds: [kind] }

    return queryOptions({
      queryKey: [name, kind, filter],
      queryFn: async () => {
        const event = await pool.get(relays, fullFilter)
        if (!event) {
          throw new Error(`${name} event not found`)
        }
        return Schema.decodeUnknownSync(schema)(event)
      },
    })
  }
}
