import type { TextNoteEvent } from '@/lib/nostr/kinds/1'
import { Virtualizer } from 'virtua'
import { useNostrEvents } from '@/lib/nostr/hooks/use-nostr-events'
import TextNote from '../text-note/TextNote'

export default function PreviewTimeline() {
  const items = useNostrEvents<TextNoteEvent>(
    _ => _.textnote(),
  )

  return (
    <div className="h-full overflow-auto">
      <Virtualizer data={items}>
        {(item, index) => (
          <div key={item.id} data-index={index} className="w-full">
            <TextNote event={item} isDisplayFooter={false} />
          </div>
        )}
      </Virtualizer>
    </div>

  )
}
