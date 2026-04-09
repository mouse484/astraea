import type { WindowVirtualizerHandle } from 'virtua'
import type { TextNoteEvent } from '@/lib/nostr/kinds/1'
import { useCallback, useRef, useState } from 'react'
import { WindowVirtualizer } from 'virtua'
import { useNostrEvents } from '@/lib/nostr/hooks/use-nostr-events'
import TextNote from '../text-note/TextNote'

interface Props {
  pubkeys?: string[] | readonly string[]
}

export default function Timeline({ pubkeys }: Props) {
  const virtualizerRef = useRef<WindowVirtualizerHandle>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isTop, setIsTop] = useState(() => {
    if (globalThis.window === undefined) {
      return true
    }

    return globalThis.window.scrollY <= 100
  })

  const handleScroll = useCallback(() => {
    const offset = virtualizerRef.current?.scrollOffset ?? globalThis.window.scrollY
    const nextIsTop = offset <= 100

    setIsTop(previous => (previous === nextIsTop ? previous : nextIsTop))
  }, [])

  // スクロールが上部かつダイアログが開いていないときだけ自動更新
  const items = useNostrEvents<TextNoteEvent>(
    _ => _.textnote(),
    event => (pubkeys ? pubkeys.includes(event.pubkey) : true),
    !isPaused && isTop,
  )

  return (
    <WindowVirtualizer ref={virtualizerRef} data={items} onScroll={handleScroll}>
      {(item, index) => (
        <div key={item.id} data-index={index} className="w-full">
          <TextNote event={item} setTimelinePaused={setIsPaused} />
        </div>
      )}
    </WindowVirtualizer>
  )
}
