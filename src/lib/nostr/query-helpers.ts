import type { Filter } from 'nostr-tools'
import type z from 'zod'
import type { ZodObject } from 'zod'
import type { QueryKeyList, QueryKeyListName } from '../query-key'
import type { RouterContext } from '@/main'
import { QueryObserver, queryOptions } from '@tanstack/react-query'
import queryKeyList from '../query-key'

export interface NostrQueryContext extends Pick<RouterContext, 'queryClient' | 'rxBackwardReq'> {
  relays?: string[]
}

export function createQuery<
  Schema extends z.infer<ZodObject<any>>,
  Name extends QueryKeyListName = QueryKeyListName,
>(
  { name, kind, filterKey }: { name: Name, kind: number, filterKey: keyof Pick<Filter, 'ids' | 'authors'> },
) {
  const queryFunction = (
    { queryClient, rxBackwardReq, relays }: NostrQueryContext,
    id: string,
    setQueryKeyFunction: ({ id, setKey }: { id: string, setKey: QueryKeyList[Name] }) => ReturnType<QueryKeyList[Name]>,
  ) => {
    const filter = {
      kinds: [kind],
      [filterKey]: [id],
    } as Filter

    const queryKey = setQueryKeyFunction({ id, setKey: queryKeyList[name] })

    return queryOptions({
      queryKey,
      queryFn: async ({ signal }) => {
        return new Promise<Schema>((resolve, reject) => {
          if (signal.aborted) {
            return reject(signal.reason)
          }
          const options = relays ? { relays } : undefined
          rxBackwardReq.emit(filter, options)
          const observer = new QueryObserver(queryClient, { queryKey })
          const unsubscribe = observer.subscribe((result) => {
            if (result.data !== undefined) {
              resolve(result.data as Schema)
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
