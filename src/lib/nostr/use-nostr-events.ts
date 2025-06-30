import type { Event } from 'nostr-tools'
import { useRouteContext } from '@tanstack/react-router'
import { fromUnixTime } from 'date-fns'
import { useEffect, useRef, useState } from 'react'

export function useNostrEvents(
  queryKey: string[],
  eventFilter?: (event: Event) => boolean,
  enabled: boolean = true,
) {
  const { queryClient } = useRouteContext({ from: '/(app)' })

  const [items, setItems] = useState<Event[]>(() => {
    return queryClient
      .getQueryCache()
      .findAll({ queryKey })
      .map(query => query.state.data as Event)
      .filter((event) => {
        return (eventFilter ? eventFilter(event) : true)
      })
      .sort((a, b) => {
        return fromUnixTime(b.created_at ?? 0).getTime() - fromUnixTime(a.created_at ?? 0).getTime()
      })
  })

  const unsbscribe = useRef<(() => void) | undefined>(undefined)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const getLatestItems = () => {
      return queryClient
        .getQueryCache()
        .findAll({ queryKey })
        .map(query => query.state.data as Event)
        .filter((event): event is Event => {
          return event?.created_at === undefined ? false : (eventFilter ? eventFilter(event) : true)
        })
        .sort((a, b) => {
          return fromUnixTime(b.created_at).getTime() - fromUnixTime(a.created_at).getTime()
        })
    }

    unsbscribe.current = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey[0] === queryKey[0]
        && (event.type === 'added' || event.type === 'updated')) {
        setItems(getLatestItems())
      }
    })

    return () => {
      unsbscribe.current?.()
      unsbscribe.current = undefined
    }
  }, [queryClient, queryKey, eventFilter, enabled])

  return items
}
