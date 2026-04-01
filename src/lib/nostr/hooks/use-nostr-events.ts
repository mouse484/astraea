import type { QueryKey } from '@tanstack/react-query'
import type { ZodType } from 'zod'
import { useRouteContext } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Returns true when two query keys are deeply equal.
 */
function queryKeyMatches(queryKeyA: QueryKey, queryKeyB: QueryKey): boolean {
  if (queryKeyA.length !== queryKeyB.length) return false
  return JSON.stringify(queryKeyA) === JSON.stringify(queryKeyB)
}

/**
 * Creates a throttled callback that runs at most once per delay window.
 */
function createThrottle(function_: () => void, delayMs: number) {
  let lastCall = 0
  let timeoutId: NodeJS.Timeout | undefined

  return () => {
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
}

export function useNostrEvents<T extends { created_at: number }>(
  queryKey: QueryKey,
  _schema: ZodType<T>,
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

      const event = data as T
      if (eventFilter && !eventFilter(event)) continue

      events.add(event)
    }

    return [...events].toSorted((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0))
  }, [eventFilter, queryClient, queryKey])

  const [items, setItems] = useState<T[]>(() => getLatestItems())
  const previousItemsRef = useRef<T[]>(items)

  const handleUpdate = useCallback(() => {
    const newItems = getLatestItems()

    if (
      previousItemsRef.current.length === newItems.length
      && previousItemsRef.current.every((item, index) => item.created_at === newItems[index].created_at)
    ) {
      return
    }

    previousItemsRef.current = newItems
    setItems(newItems)
  }, [getLatestItems])

  const throttledUpdateRef = useRef(createThrottle(handleUpdate, 100))

  useEffect(() => {
    if (!enabled) {
      return
    }

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        Array.isArray(event.query.queryKey)
        && queryKeyMatches(event.query.queryKey, queryKey)
        && (event.type === 'added' || event.type === 'updated')
      ) {
        throttledUpdateRef.current()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [queryClient, queryKey, enabled, handleUpdate])

  return items
}
