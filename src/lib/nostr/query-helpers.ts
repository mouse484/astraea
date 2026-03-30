import type { UseQueryOptions } from '@tanstack/react-query'
import type { Filter } from 'nostr-tools'
import type z from 'zod'
import type { QueryKeyList, QueryKeyListName } from '../query-key'
import type { RouterContext } from '@/main'
import { QueryObserver, queryOptions } from '@tanstack/react-query'
import queryKeyList from '../query-key'

export interface NostrQueryContext extends Pick<RouterContext, 'queryClient' | 'rxBackwardReq'> {
  relays?: string[]
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
  { name, kind, filterKey }: QueryConfig<Schema, Name>,
): NostrQueryFunction<Schema, Name> {
  const queryFunction: NostrQueryFunction<Schema, Name> = (
    { queryClient, rxBackwardReq, relays },
    id,
    setQueryKeyFunction,
  ) => {
    const filter = {
      kinds: [kind],
      [filterKey]: [id],
    } as Filter

    const queryKey = setQueryKeyFunction({ id, setKey: queryKeyList[name] })

    return queryOptions<z.output<Schema>, Error, z.output<Schema>, readonly unknown[]>({
      queryKey,
      queryFn: async ({ signal }) => {
        return new Promise<z.infer<Schema>>((resolve, reject) => {
          if (signal.aborted) {
            reject(signal.reason)
          }
          const options = relays ? { relays } : undefined
          rxBackwardReq.emit(filter, options)
          const observer = new QueryObserver(queryClient, { queryKey })
          const unsubscribe = observer.subscribe((result) => {
            if (result.data !== undefined) {
              resolve(result.data as z.infer<Schema>)
            }
          })

          signal.addEventListener('abort', () => {
            unsubscribe()
            reject(new Error('Query aborted'))
          }, { signal })
        })
      },
    })
  }

  return queryFunction
}
