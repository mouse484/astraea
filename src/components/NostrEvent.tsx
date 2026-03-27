import type { createQuery } from '@/lib/nostr/query-helpers'
import { useQuery } from '@tanstack/react-query'
import useNostr from '@/lib/nostr/hooks/use-nostr'

interface Props<T> {
  queryOptions: ReturnType<typeof createQuery<T>>
  eventId: string
  children?: (event: T) => React.ReactNode
}

export default function NostrEvent<T>({ queryOptions, eventId, children }: Props<T>): React.ReactNode {
  const { getQueryOption } = useNostr()
  const { data } = useQuery(
    getQueryOption(queryOptions, eventId),
  )

  if (!data || !children) {
    return <></>
  }

  return children(data)
}
