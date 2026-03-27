import type z from 'zod'
import type { createQuery } from '@/lib/nostr/query-helpers'
import { useQuery } from '@tanstack/react-query'
import useNostr from '@/lib/nostr/hooks/use-nostr'

interface Props<T extends z.ZodObject<any>> {
  queryOptions: ReturnType<typeof createQuery<T>>
  eventId: string
  children?: (event: z.output<T>) => React.ReactNode
}

export default function NostrEvent<T extends z.ZodObject<any>>({ queryOptions, eventId, children }: Props<T>): React.ReactNode {
  const { getQueryOption } = useNostr()
  const { data } = useQuery(
    getQueryOption(queryOptions, eventId),
  )

  if (!data || !children) {
    return <></>
  }

  return children(data)
}
