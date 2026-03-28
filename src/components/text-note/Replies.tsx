import { useNostrEvents } from '@/lib/nostr/hooks/use-nostr-events'
import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import queryKeyList from '@/lib/query-key'
import TextNote from './TextNote'

interface Props {
  id: string
}

export default function Replies({ id }: Props) {
  const replies = useNostrEvents(
    queryKeyList.reply(id),
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
