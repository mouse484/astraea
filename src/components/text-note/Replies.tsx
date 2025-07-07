import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useNostrEvents } from '@/lib/nostr/use-nostr-events'
import TextNote from './TextNote'

interface Props {
  id: string
}

export default function Replies({ id }: Props) {
  const replies = useNostrEvents(['reply', id], TextNoteEventSchema)

  return (
    <div className="border-l-4 pl-4">
      {replies.map(reply => (
        <TextNote key={reply.id} event={reply} withReplies={true} />
      ))}
    </div>
  )
}
