import type z from 'zod'
import type { QueryFunction } from '@/lib/nostr/query-helpers'
import { useQuery } from '@tanstack/react-query'
import useNostr from '@/lib/nostr/hooks/use-nostr'

interface Props<T extends z.infer<z.ZodObject<any>>> {
  queryFunction: QueryFunction<T>
  queryOptions: readonly [
    string,
    Parameters<QueryFunction<T>>[2],
  ]
  children?: (event: T) => React.ReactNode
}

export default function NostrEvent<T extends z.infer<z.ZodObject<any>>>({
  queryFunction,
  queryOptions,
  children,
}: Props<T>): React.ReactNode {
  const { queryContext } = useNostr()
  const [id, setQueryKeyFunction] = queryOptions

  const options = queryFunction(queryContext, id, setQueryKeyFunction)

  const { data } = useQuery(options)

  if (!data || !children) {
    return <></>
  }

  return children(data)
}
