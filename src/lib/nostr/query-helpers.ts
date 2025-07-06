import type { Filter } from 'nostr-tools'
import type { RouterContext } from '@/main'
import { queryOptions } from '@tanstack/react-query'
import { Schema } from 'effect'

interface NostrQueryContext extends Pick<RouterContext, 'pool'> {
  relays: string[]
}

type QueryKeyList = 'metadata' | 'textnote' | 'reaction' | 'followlist' | 'relaylist'

interface QueryConfig<T, I = T> {
  name: QueryKeyList
  schema: Schema.Schema<T, I>
  kind: number
  filterKey: keyof Pick<Filter, 'ids' | 'authors'>
}

export function createQuery<T, I = T>({ name, schema, kind, filterKey }: QueryConfig<T, I>) {
  return ({ pool, relays }: NostrQueryContext, id: string) => {
    const filter: Filter = {
      kinds: [kind],
    }
    filter[filterKey] = [id]

    return queryOptions({
      queryKey: [name, id],
      queryFn: async () => {
        const event = await pool.get(relays, filter)
        if (!event) {
          throw new Error(`${name} event not found`)
        }
        return await Schema.decodeUnknownPromise(schema)(event)
          .catch((error) => {
            console.error(error)
            throw error
          })
      },
    })
  }
}
