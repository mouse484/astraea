import { useNostrEvents } from '@/lib/nostr/hooks/use-nostr-events'
import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import queryKeys from '@/lib/query-keys'
import TextNote from './TextNote'

interface Props {
  id: string
}

export default function Replies({ id }: Props) {
  const replies = useNostrEvents(
    queryKeys.reply(id),
    TextNoteEventSchema,
  )

  return (
    <div className="border-l-4 pl-4">
      {replies.map(reply => (
        <TextNote key={reply.id} event={reply} withReplies={true} />
      ))}
    </div>
  )
}
