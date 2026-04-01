import type { TextNoteEvent } from '@/lib/nostr/kinds/1'
import { useNostrEvents } from '@/lib/nostr/hooks/use-nostr-events'
import TextNote from './TextNote'

interface Props {
  id: string
}

export default function Replies({ id }: Props) {
  const replies = useNostrEvents<TextNoteEvent>(
    _ => _.reply(id),
  )

  return (
    <div className="border-l-4 pl-4">
      {replies.map(reply => (
        <TextNote key={reply.id} event={reply} withReplies={true} />
      ))}
    </div>
  )
}
