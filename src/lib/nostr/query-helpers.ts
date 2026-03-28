import type { UseQueryOptions } from '@tanstack/react-query'
import type { Filter } from 'nostr-tools'
import type z from 'zod'
import type { QueryKeyList, QueryKeyListName } from '../query-key'
import type { RouterContext } from '@/main'
import { queryOptions } from '@tanstack/react-query'
import queryKeyList from '../query-key'

export interface NostrQueryContext extends Pick<RouterContext, 'pool'> {
  relays: string[]
}

export type NostrQueryOptions<Schema extends z.ZodObject<any>> = UseQueryOptions<
  z.output<Schema>,
  Error,
  z.output<Schema>,
  readonly unknown[]
>

interface QueryConfig<
  Schema extends z.ZodObject<any>,
  Name extends QueryKeyListName,
> {
  name: Name
  schema: Schema
  kind: number
  filterKey: keyof Pick<Filter, 'ids' | 'authors'>
}

export type SetQueryKeyFunction<Name extends QueryKeyListName> = ({
  id,
  setKey,
}: {
  id: string
  setKey: QueryKeyList[Name]
}) => ReturnType<QueryKeyList[Name]>

export type NostrQueryFunction<
  Schema extends z.ZodObject<any>,
  Name extends QueryKeyListName,
> = (
  context: NostrQueryContext,
  id: string,
  setQueryKeyFunction: SetQueryKeyFunction<Name>,
) => NostrQueryOptions<Schema>

export function createQuery<
  Schema extends z.ZodObject<any>,
  Name extends QueryKeyListName,
>(
  { name, schema, kind, filterKey }: QueryConfig<Schema, Name>,
): NostrQueryFunction<Schema, Name> {
  const queryFunction: NostrQueryFunction<Schema, Name> = (
    { pool, relays },
    id,
    setQueryKeyFunction,
  ) => {
    const filter = {
      kinds: [kind],
      [filterKey]: [id],
    } as Filter

    const queryKey = setQueryKeyFunction({ id, setKey: queryKeyList[name] })

    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    return queryOptions<z.output<Schema>, Error, z.output<Schema>, readonly unknown[]>({
      queryKey,
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

  return queryFunction
}
