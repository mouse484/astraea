import type { QueryClient, UseQueryOptions } from '@tanstack/react-query'
import type { Event, Filter } from 'nostr-typedef'
import type * as z from 'zod'
import type { QueryKeyList, QueryKeyListName } from '../query-key'
import type { RouterContext } from '@/main'
import { QueryObserver, queryOptions } from '@tanstack/react-query'
import queryKeyList from '../query-key'

export interface NostrQueryContext
  extends Pick<RouterContext, 'queryClient' | 'rxBackwardReq'> {
  relays?: string[]
}

export type SetQueryKeyFunctionParameter = (
  context: { id: string, setKey: QueryKeyList[QueryKeyListName] },
) => readonly string[]

export type QueryOptions = readonly [
  string,
  SetQueryKeyFunctionParameter,
  { relays?: string[] }?,
]

export type QueryFunction<Schema extends z.infer<z.ZodObject<any>>> = (
  context: NostrQueryContext,
  id: string,
  setQueryKeyFunction: SetQueryKeyFunctionParameter,
) => UseQueryOptions<Schema, Error, Schema, readonly string[]>

export type SetQueryFunction<Schema extends z.infer<z.ZodObject<any>>> = (
  queryClient: QueryClient,
  event: Event,
  setQueryKeyFunction: (
    context: { setKey: QueryKeyList[QueryKeyListName], event: Schema },
  ) => readonly string[],
) => void

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
      { queryClient, rxBackwardReq, relays },
      id,
      setQueryKeyFunction,
    ) {
      const filter = {
        kinds: [kind],
        ...(filterKey ? { [filterKey]: [id] } : {}),
      } as Filter

      const queryKey = setQueryKeyFunction({ id, setKey: queryKeyList[name] })

      return queryOptions({
        queryKey,
        queryFn: async () => {
          const signal = AbortSignal.any([
            /**
             * QueryFn signal + Tanstack Routerのローダー相性が悪い?ので一旦コメントアウト
             * @see https://github.com/TanStack/router/issues/4476
             */
            // context.signal,
            AbortSignal.timeout(5 * 1000), // 5 seconds
          ])
          return new Promise<z.infer<Schema>>((resolve, reject) => {
            if (signal.aborted) {
              return reject(signal.reason)
            }

            const options = relays ? { relays } : undefined

            let settled = false
            let unsubscribe: (() => void) | undefined

            const observer = new QueryObserver<z.infer<Schema>>(queryClient, { queryKey })

            const onAbort = (_event?: globalThis.Event) => {
              if (settled) return
              settled = true
              signal.removeEventListener('abort', onAbort)
              queueMicrotask(() => unsubscribe?.())
              reject(new Error('Query aborted'))
            }

            signal.addEventListener('abort', onAbort)

            unsubscribe = observer.subscribe((result) => {
              if (result.data !== undefined) {
                if (settled) return
                settled = true
                signal.removeEventListener('abort', onAbort)
                queueMicrotask(() => unsubscribe?.())
                resolve(result.data)
              }
            })

            rxBackwardReq.emit(filter, options)
          })
        },
      })
    },
    function setQueryFunction(
      queryClient,
      event,
      setQueryKeyFunction,
    ) {
      const parsed = schema.safeParse(event)
      if (parsed.success) {
        const queryKey = setQueryKeyFunction({ setKey: queryKeyList[name], event: parsed.data })
        queryClient.setQueryData<z.infer<Schema>>(queryKey, parsed.data)
      } else {
        console.error('Failed to parse event:', parsed.error)
      }
    },
  ] satisfies [QueryFunction<z.infer<Schema>>, SetQueryFunction<z.infer<Schema>>]
}
