import type { QueryKey } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { Schema } from 'effect'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useNostrEvents<T extends { created_at: number }, I = T>(
  queryKey: QueryKey,
  schema: Schema.Schema<T, I>,
  eventFilter?: (event: T) => boolean,
  enabled: boolean = true,
) {
  const { queryClient } = useRouteContext({ from: '/(app)' })

  const getLatestItems = useCallback(() => {
    if (queryKey.length <= 0) {
      return []
    }

    const events = new Set<T>()
    const queries = queryClient.getQueryCache().findAll({ queryKey })

    for (const query of queries) {
      const data = query.state.data
      if (data === undefined || data === null) continue

      const decodedEvent = Schema.decodeUnknownEither(schema)(data)
      if (decodedEvent._tag === 'Left') {
        console.warn('Invalid event:', decodedEvent.left)
        continue
      }

      const event = decodedEvent.right
      if (eventFilter && !eventFilter(event)) continue

      events.add(event)
    }

    return [...events].sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0))
  }, [eventFilter, queryClient, queryKey, schema])

  const [items, setItems] = useState<T[]>(() => getLatestItems())

  const unsubscribe = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    if (!enabled) {
      return
    }

    unsubscribe.current = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === queryKey[0]
        && (event.type === 'added' || event.type === 'updated')) {
        setItems(getLatestItems())
      }
    })

    return () => {
      unsubscribe.current?.()
      unsubscribe.current = undefined
    }
  }, [queryClient, queryKey, eventFilter, enabled, getLatestItems])

  return items
}
