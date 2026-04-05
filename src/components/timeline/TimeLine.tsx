import type { TextNoteEvent } from '@/lib/nostr/kinds/1'
import { useState } from 'react'
import { Virtualizer } from 'virtua'
import { useNostrEvents } from '@/lib/nostr/hooks/use-nostr-events'
import TextNote from '../text-note/TextNote'

interface Props {
  pubkeys?: string[] | readonly string[]
}

export default function TimeLine({ pubkeys }: Props) {
  const [isPaused, setIsPaused] = useState(false)
  const [scrollOffset, setScrollOffset] = useState(0)

  const isTop = scrollOffset <= 100
  // スクロールが上部かつダイアログが開いていないときだけ自動更新
  const items = useNostrEvents<TextNoteEvent>(
    _ => _.textnote(),
    event => (pubkeys ? pubkeys.includes(event.pubkey) : true),
    !isPaused && isTop,
  )

  return (
    <div className="size-full overflow-y-auto">
      <Virtualizer
        data={items}
        onScroll={setScrollOffset}
      >
        {(item, index) => (
          <div key={item.id} data-index={index} className="w-full">
            <TextNote event={item} setTimelinePaused={setIsPaused} />
          </div>
        )}
      </Virtualizer>
    </div>
  )
}
