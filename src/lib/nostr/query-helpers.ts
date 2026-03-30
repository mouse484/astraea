import type { QueryClient } from '@tanstack/react-query'
import type { Filter } from 'nostr-tools'
import type { Event } from 'nostr-typedef'
import type z from 'zod'
import type { QueryKeyList, QueryKeyListName } from '../query-key'
import type { RouterContext } from '@/main'
import { QueryObserver, queryOptions } from '@tanstack/react-query'
import queryKeyList from '../query-key'

export interface NostrQueryContext
  extends Pick<RouterContext, 'queryClient' | 'rxBackwardReq'> {
  relays?: string[]
}

export function createQuery<
  Schema extends z.ZodObject<any>,
  Name extends QueryKeyListName = QueryKeyListName,
>(
  { name, kind, schema, filterKey }: {
    name: Name
    kind: number
    schema: Schema
    // TODO: フィルターの仕組み検討する
    filterKey: keyof Pick<Filter, 'ids' | 'authors'> | undefined
  },
) {
  return [
    function queryFunction(
      { queryClient, rxBackwardReq, relays }: NostrQueryContext,
      id: string,
      setQueryKeyFunction: (
        { id, setKey }: { id: string, setKey: QueryKeyList[Name] },
      ) => ReturnType<QueryKeyList[Name]>,
    ) {
      const filter = {
        kinds: [kind],
        ...(filterKey ? { [filterKey]: [id] } : {}),
      } as Filter

      const queryKey = setQueryKeyFunction({ id, setKey: queryKeyList[name] })

      return queryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
          return new Promise<z.infer<Schema>>((resolve, reject) => {
            if (signal.aborted) {
              return reject(signal.reason)
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
    },
    function setQueryFunction(
      queryClient: QueryClient,
      event: Event,
      setQueryKeyFunction: (
        { setKey, event }: { setKey: QueryKeyList[Name], event: z.infer<Schema> },
      ) => ReturnType<QueryKeyList[Name | QueryKeyListName]>,
    ) {
      const parsed = schema.safeParse(event)
      if (parsed.success) {
        const queryKey = setQueryKeyFunction({ setKey: queryKeyList[name], event: parsed.data })
        return queryClient.setQueryData<z.infer<Schema>>(queryKey, parsed.data)
      } else {
        console.error('Failed to parse event:', parsed.error)
      }
    },
  ] as const
}
