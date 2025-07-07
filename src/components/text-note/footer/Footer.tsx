import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useMutation } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { Heart, Repeat2, Zap } from 'lucide-react'
import { ReactionEventSchema } from '@/lib/nostr/kinds/7'
import useNostr from '@/lib/nostr/use-nostr'
import { useNostrEvents } from '@/lib/nostr/use-nostr-events'
import Emoji from './Emoji'
import Reaction from './Reaction'
import Reply from './Reply'
import Share from './Share'

interface Props {
  event: typeof TextNoteEventSchema.Type
}

export default function Footer({ event }: Props) {
  const reactions = useNostrEvents(
    ['reaction', event?.id],
    ReactionEventSchema,
  )
  const { queryClient } = useRouteContext({ from: '/(app)' })
  const { publishEvent } = useNostr()

  const reactionMutation = useMutation({
    mutationFn: async (content: string) => {
      const result = await publishEvent(ReactionEventSchema, {
        kind: 7,
        content,
        tags: [
          ['e', event.id],
          ['p', event.pubkey],
        ],
      })
      if (!result) {
        throw new Error(`Failed to publish reaction event for content: ${content}`)
      }
      return result
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['reaction', event.id, data.content], data)
    },
  })

  const likeReactions: typeof reactions = []
  const otherReactions = new Map<string, typeof reactions>()

  for (const reaction of reactions) {
    if (!reaction.content?.trim()) {
      continue
    }

    if (reaction.content === '+') {
      likeReactions.push(reaction)
    } else {
      const existingReactions = otherReactions.get(reaction.content) ?? []
      otherReactions.set(reaction.content, [...existingReactions, reaction])
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative flex w-full justify-between">
        <Reply event={event} />
        <Repeat2 />
        <Reaction
          activeClassName="text-red-400 [&>svg]:fill-red-400"
          content="+"
          mutation={reactionMutation}
          reactions={likeReactions}
        >
          <Heart />
        </Reaction>
        <Emoji mutation={reactionMutation} />
        <Zap />
        <Share event={event} />
      </div>
      <div className="flex flex-wrap gap-2">
        {[...otherReactions.entries()].map(([content, reactionList]) => (
          <Reaction
            key={content}
            activeClassName="bg-primary/10"
            content={content}
            mutation={reactionMutation}
            reactions={reactionList}
          >
            {content}
          </Reaction>
        ))}
      </div>
    </div>
  )
}
