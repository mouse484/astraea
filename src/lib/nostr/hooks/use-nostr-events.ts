import type { QueryKey } from '@tanstack/react-query'
import type { NostrEvent } from '../nips/01'
import type { QueryKeyList } from '@/lib/query-key'
import { useRouteContext } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import queryKeyList from '@/lib/query-key'

/**
 * Creates a throttled callback that runs at most once per delay window.
 */
function createThrottle(function_: () => void, delayMs: number) {
  let lastCall = 0
  let timeoutId: ReturnType<typeof globalThis.setTimeout> | undefined
  let cancelled = false

  const run = () => {
    if (cancelled) {
      return
    }

    const now = Date.now()
    const timeSinceLastCall = now - lastCall

    if (timeSinceLastCall >= delayMs) {
      lastCall = now
      function_()
    } else {
      clearTimeout(timeoutId)
      timeoutId = globalThis.setTimeout(() => {
        lastCall = Date.now()
        function_()
      }, delayMs - timeSinceLastCall)
    }
  }

  const cancel = () => {
    cancelled = true
    clearTimeout(timeoutId)
    timeoutId = undefined
  }

  return { run, cancel }
}

export function useNostrEvents<
  Event extends NostrEvent,
>(
  setQueryKey: (_: QueryKeyList) => QueryKey,
  eventFilter?: (event: Event) => boolean,
  enabled: boolean = true,
) {
  const { queryClient } = useRouteContext({ from: '/(app)' })

  const queryKey = setQueryKey(queryKeyList)

  const getLatestItems = useCallback(() => {
    if (queryKey.length <= 0) {
      return []
    }

    const events = new Set<Event>()
    const queries = queryClient.getQueryCache().findAll({ queryKey })

    for (const query of queries) {
      const data = query.state.data
      if (data === undefined || data === null) continue

      const event = data as Event
      if (eventFilter && !eventFilter(event)) continue

      events.add(event)
    }

    return [...events].toSorted((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0))
  }, [eventFilter, queryClient, queryKey])

  const [items, setItems] = useState<Event[]>(() => getLatestItems())
  const previousItemsRef = useRef<Event[]> (items)

  const handleUpdate = useCallback(() => {
    const newItems = getLatestItems()

    if (
      previousItemsRef.current.length === newItems.length
      && previousItemsRef.current.every((item, index) => item.id === newItems[index].id)
    ) {
      return
    }

    previousItemsRef.current = newItems
    setItems(newItems)
  }, [getLatestItems])

  const latestHandleUpdateRef = useRef(handleUpdate)

  useEffect(() => {
    latestHandleUpdateRef.current = handleUpdate
  }, [handleUpdate])

  const throttledUpdateRef = useRef(createThrottle(() => {
    latestHandleUpdateRef.current()
  }, 100))

  useEffect(() => {
    if (!enabled) {
      return
    }

    throttledUpdateRef.current = createThrottle(() => {
      latestHandleUpdateRef.current()
    }, 100)

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        Array.isArray(event.query.queryKey)
        // simple kind check, ["textnote", ...] ["metadata", ...] etc
        && event.query.queryKey[0] === queryKey[0]
        && (event.type === 'added' || event.type === 'updated')
      ) {
        throttledUpdateRef.current.run()
      }
    })

    return () => {
      unsubscribe()
      throttledUpdateRef.current.cancel()
    }
  }, [queryClient, queryKey, enabled])

  return items
}
