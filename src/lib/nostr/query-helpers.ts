import type { Filter } from 'nostr-tools'
import type z from 'zod'
import type { QueryKeyList } from '../query-keys'
import type { RouterContext } from '@/main'
import { queryOptions } from '@tanstack/react-query'

interface NostrQueryContext extends Pick<RouterContext, 'pool'> {
  relays: string[]
}

interface QueryConfig<T extends z.ZodObject<any>> {
  name: QueryKeyList
  schema: T
  kind: number
  filterKey: keyof Pick<Filter, 'ids' | 'authors'>
}

export function createQuery<T extends z.ZodObject<any>>({ name, schema, kind, filterKey }: QueryConfig<T>) {
  return ({ pool, relays }: NostrQueryContext, id: string) => {
    const filter = {
      kinds: [kind],
      [filterKey]: [id],
    } as Filter

    return queryOptions({
      queryKey: [name, id, schema],
      queryFn: async () => {
        const event = await pool.get(relays, filter)
        if (!event) {
          throw new Error(`${name} event not found`)
        }

        return schema.parseAsync(event)
          .catch((error) => {
            console.error(error, schema.shape)
            throw error
          })
      },
    })
  }
}
