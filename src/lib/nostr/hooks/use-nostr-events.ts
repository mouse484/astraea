import type { QueryKey } from '@tanstack/react-query'
import type { ZodType } from 'zod'
import { useRouteContext } from '@tanstack/react-router'
import { useCallback, useEffect, useRef, useState } from 'react'

// queryKey が完全に一致するかチェック
function queryKeyMatches(queryKeyA: QueryKey, queryKeyB: QueryKey): boolean {
  if (queryKeyA.length !== queryKeyB.length) return false
  return JSON.stringify(queryKeyA) === JSON.stringify(queryKeyB)
}

// throttle ユーティリティ
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

      // TODO: schemaのparseはイベント取得時に行なっているので、ここでは行わないようにする
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
  const previousItemsRef = useRef<T[]>(items)

  const unsubscribeRef = useRef<(() => void) | undefined>(undefined)

  // setItems をメモ化：実際に変更があった場合のみ呼ぶ
  const handleUpdate = useCallback(() => {
    const newItems = getLatestItems()

    // 前回の結果と比較（長さと created_at で簡易比較）
    if (
      previousItemsRef.current.length === newItems.length
      && previousItemsRef.current.every((item, index) => item.created_at === newItems[index].created_at)
    ) {
      return // 変更なし、スキップ
    }

    previousItemsRef.current = newItems
    setItems(newItems)
  }, [getLatestItems])

  // throttle 100ms を適用
  const throttledUpdateRef = useRef(createThrottle(handleUpdate, 100))

  useEffect(() => {
    if (!enabled) {
      return
    }

    unsubscribeRef.current = queryClient.getQueryCache().subscribe((event) => {
      // queryKey の完全比較
      if (
        Array.isArray(event.query.queryKey)
        && queryKeyMatches(event.query.queryKey, queryKey)
        && (event.type === 'added' || event.type === 'updated')
      ) {
        throttledUpdateRef.current()
      }
    })

    return () => {
      unsubscribeRef.current?.()
      unsubscribeRef.current = undefined
    }
  }, [queryClient, queryKey, enabled, handleUpdate])

  return items
}
