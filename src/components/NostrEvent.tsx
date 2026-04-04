import type * as z from 'zod'
import type { NostrQueryContext, QueryFunction, QueryOptions } from '@/lib/nostr/query-helpers'
import { useQuery } from '@tanstack/react-query'
import useNostr from '@/lib/nostr/hooks/use-nostr'

interface Props<T extends z.infer<z.ZodObject<any>>> {
  queryFunction: QueryFunction<T>
  queryOptions: QueryOptions
  children?: (event: T) => React.ReactNode
}

export default function NostrEvent<T extends z.infer<z.ZodObject<any>>>({
  queryFunction,
  queryOptions,
  children,
}: Props<T>): React.ReactNode {
  const { queryContext } = useNostr()
  const [id, setQueryKeyFunction, options] = queryOptions

  const context: NostrQueryContext = options?.relays
    ? {
        ...queryContext,
        relays: options.relays,
      }
    : queryContext

  const option = queryFunction(context, id, setQueryKeyFunction)

  const { data } = useQuery(option)

  if (!data || !children) {
    return <></>
  }

  return children(data)
}
