import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useMutation } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { Heart, Zap } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ReactionEventSchema } from '@/lib/nostr/kinds/7'
import useNostr from '@/lib/nostr/use-nostr'
import { useNostrEvents } from '@/lib/nostr/use-nostr-events'
import queryKeys from '@/lib/query-keys'
import TextNoteForm from '../form/TextNoteForm'
import Emoji from './Emoji'
import Reaction from './Reaction'
import Reply from './Reply'
import Repost from './Repost'
import Share from './Share'

interface Props {
  event: typeof TextNoteEventSchema.Type
}

export default function Footer({ event }: Props) {
  const [openForm, setOpenForm] = useState<'reply' | 'repost' | undefined>()
  const reactions = useNostrEvents(
    queryKeys.reaction(event.id),
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
      queryClient.setQueryData(
        queryKeys.reaction(event.id, data.pubkey, data.content),
        data,
      )
    },
  })

  const { likeReactions, otherReactions } = useMemo(() => {
    const likes: typeof reactions = []
    const others = new Map<string, typeof reactions>()

    for (const reaction of reactions) {
      if (!reaction.content?.trim()) {
        continue
      }

      if (reaction.content === '+') {
        likes.push(reaction)
      } else {
        const existingReactions = others.get(reaction.content) ?? []
        others.set(reaction.content, [...existingReactions, reaction])
      }
    }

    return { likeReactions: likes, otherReactions: others }
  }, [reactions])

  return (
    <div className="relative w-full space-y-4">
      <div className="flex w-full justify-between">
        <Reply
          event={event}
          isOpen={openForm === 'reply'}
          onToggle={(open: boolean) => setOpenForm(open ? 'reply' : undefined)}
        />
        <Repost
          event={event}
          isOpen={openForm === 'repost'}
          onToggle={(open: boolean) => setOpenForm(open ? 'repost' : undefined)}
        />
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
      {openForm && (
        <div
          className="bg-card border-border rounded-lg border p-4 shadow-lg"
        >
          <div className="text-muted-foreground mb-3 text-sm font-medium">
            {openForm === 'reply' ? 'Reply' : 'Repost'}
          </div>
          <TextNoteForm
            {...(openForm === 'reply' ? { reply: event } : { repost: event })}
            onSuccess={() => {
              setOpenForm(undefined)
            }}
          />
        </div>
      )}
    </div>
  )
}
