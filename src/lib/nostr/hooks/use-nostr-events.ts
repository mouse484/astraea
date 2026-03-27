import type { QueryKey } from '@tanstack/react-query'
import type { ZodType } from 'zod'
import { useRouteContext } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useNostrEvents<T extends { created_at: number }>(
  queryKey: QueryKey,
  schema: ZodType<T>,
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

      const decodedEvent = schema.safeParse(data)
      if (!decodedEvent.success) {
        console.warn('Invalid event:', decodedEvent.error)
        continue
      }

      const event = decodedEvent.data
      if (eventFilter && !eventFilter(event)) continue

      events.add(event)
    }

    return [...events].toSorted((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0))
  }, [eventFilter, queryClient, queryKey, schema])

  const [items, setItems] = useState<T[]>(() => getLatestItems())

  const unsubscribeRef = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    if (!enabled) {
      return
    }

    unsubscribeRef.current = queryClient.getQueryCache().subscribe((event) => {
      if (Array.isArray(event.query.queryKey) && event.query.queryKey[0] === queryKey[0]
        && (event.type === 'added' || event.type === 'updated')) {
        setItems(getLatestItems())
      }
    })

    return () => {
      unsubscribeRef.current?.()
      unsubscribeRef.current = undefined
    }
  }, [queryClient, queryKey, eventFilter, enabled, getLatestItems])

  return items
}
