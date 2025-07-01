import type { Event } from 'nostr-tools'
import { useRouteContext } from '@tanstack/react-router'
import { fromUnixTime } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useNostrEvents(
  queryKey: (string | undefined)[],
  eventFilter?: (event: Event) => boolean,
  enabled: boolean = true,
) {
  const { queryClient } = useRouteContext({ from: '/(app)' })

  const getLatestItems = useCallback(() => {
    const validQueryKey = queryKey.filter((key): key is string => typeof key === 'string')
    if (validQueryKey.length === 0) {
      return []
    }

    return queryClient
      .getQueryCache()
      .findAll({ queryKey: validQueryKey })
      .map(query => query.state.data)
      .filter((data): data is Event => data !== undefined && data !== null)
      .filter((event) => {
        return eventFilter ? eventFilter(event) : true
      })
      .sort((a, b) => {
        return fromUnixTime(b.created_at ?? 0).getTime() - fromUnixTime(a.created_at ?? 0).getTime()
      })
  }, [eventFilter, queryClient, queryKey])

  const [items, setItems] = useState<Event[]>(() => getLatestItems())

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
