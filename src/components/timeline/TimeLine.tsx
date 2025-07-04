import { useVirtualizer } from '@tanstack/react-virtual'
import { Schema } from 'effect'
import { useRef } from 'react'
import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useNostrEvents } from '@/lib/nostr/use-nostr-events'
import TextNote from '../text-note/TextNote'

interface Props {
  pubkeys?: string[] | readonly string[]
}

export default function TimeLine({ pubkeys }: Props) {
  const parentReference = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: 9999,
    getScrollElement: () => parentReference.current,
    estimateSize: () => 200,
    overscan: 3,
  })

  const isTop = (virtualizer.scrollOffset ?? 0) <= 100
  const items = useNostrEvents(
    ['textnote'],
    event => (pubkeys ? pubkeys.includes(event.pubkey) : true),
    isTop,
  )

  virtualizer.options.count = items.length

  return (
    <div ref={parentReference} className="h-full w-full overflow-y-auto">
      <div
        className="relative w-full p-2"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index]
          const result = Schema.decodeUnknownSync(TextNoteEventSchema)(item)
          return (
            <div
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute top-0 left-0 w-full"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TextNote
                key={item.id}
                event={result}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
