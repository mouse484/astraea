import type z from 'zod'
import type { NostrQueryContext, NostrQueryOptions } from '@/lib/nostr/query-helpers'
import { useQuery } from '@tanstack/react-query'
import useNostr from '@/lib/nostr/hooks/use-nostr'

interface Props<Schema extends z.ZodObject<any>> {
  queryOptions: (context: NostrQueryContext) => NostrQueryOptions<Schema>
  children?: (event: z.output<Schema>) => React.ReactNode
}

export default function NostrEvent<Schema extends z.ZodObject<any>>({
  queryOptions,
  children,
}: Props<Schema>): React.ReactNode {
  const { queryContext } = useNostr()
  const queryOption = queryOptions(queryContext)
  const { data } = useQuery<z.output<Schema>>(queryOption)

  if (!data || !children) {
    return <></>
  }

  return children(data)
}
