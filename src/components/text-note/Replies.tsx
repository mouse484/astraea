import { useRouteContext } from '@tanstack/react-router'
import { Schema } from 'effect'
import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import TextNote from './TextNote'

interface Props {
  id: string
}

export default function Replies({ id }: Props) {
  const { queryClient } = useRouteContext({ from: '/(app)' })

  const cacheReplies = queryClient
    .getQueryCache()
    .findAll({ queryKey: ['reply', id] })

  const replies = cacheReplies.map((item) => {
    return Schema.decodeUnknownSync(TextNoteEventSchema)(item.state.data)
  }).sort((a, b) => {
    return (b.created_at ?? 0) - (a.created_at ?? 0)
  })

  return (
    <div className="border-l-4 pl-4">
      {replies.map(reply => (
        <TextNote key={reply.id} event={reply} withReplies={true} />
      ))}
    </div>
  )
}
