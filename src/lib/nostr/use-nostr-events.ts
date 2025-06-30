import type { Event } from 'nostr-tools'
import { useRouteContext } from '@tanstack/react-router'
import { fromUnixTime } from 'date-fns'
import { useCallback, useEffect, useRef, useState } from 'react'

export function useNostrEvents(
  queryKey: string[],
  eventFilter?: (event: Event) => boolean,
  enabled: boolean = true,
) {
  const { queryClient } = useRouteContext({ from: '/(app)' })

  const getLatestItems = useCallback(() => queryClient
    .getQueryCache()
    .findAll({ queryKey })
    .map(query => query.state.data as Event)
    .filter((event) => {
      return (eventFilter ? eventFilter(event) : true)
    })
    .sort((a, b) => {
      return fromUnixTime(b.created_at ?? 0).getTime() - fromUnixTime(a.created_at ?? 0).getTime()
    }), [eventFilter, queryClient, queryKey])

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
