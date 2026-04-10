import type * as z from 'zod'
import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import type { ReactionEvent } from '@/lib/nostr/kinds/7'
import { useMutation } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import useNostr from '@/lib/nostr/hooks/use-nostr'
import { useNostrEvents } from '@/lib/nostr/hooks/use-nostr-events'
import { ReactionEventSchema } from '@/lib/nostr/kinds/7'
import queryKeyList from '@/lib/query-key'
import Emoji from './Emoji'
import Reaction from './Reaction'
import Reply from './Reply'
import Repost from './Repost'
import Share from './Share'
import Zap from './Zap'

const TextNoteForm = lazy(async () => import('../form/TextNoteForm'))

interface Props {
  event: z.infer<typeof TextNoteEventSchema>
  setTimelinePaused?: (paused: boolean) => void
}

export default function Footer({ event, setTimelinePaused }: Props) {
  const [openForm, setOpenForm] = useState<'reply' | 'repost' | undefined>()
  const reactions = useNostrEvents<ReactionEvent>(
    _ => _.reaction(event.id),
  )
  const { queryClient } = useRouteContext({ from: '__root__' })
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
        queryKeyList.reaction(event.id, data.pubkey, data.content),
        data,
      )
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
    <div className="relative w-full space-y-4">
      <div className="flex w-full justify-between">
        <Reply
          event={event}
          isOpen={openForm === 'reply'}
          setTimelinePaused={setTimelinePaused}
          onToggle={(open: boolean) => setOpenForm(open ? 'reply' : undefined)}
        />
        <Repost
          event={event}
          isOpen={openForm === 'repost'}
          setTimelinePaused={setTimelinePaused}
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
        <Emoji mutation={reactionMutation} setTimelinePaused={setTimelinePaused} />
        <Zap event={event} setTimelinePaused={setTimelinePaused} />
        <Share event={event} />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from(otherReactions.entries(), ([content, reactionList]) => (
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
          className="rounded-lg border border-border bg-card p-4 shadow-lg"
        >
          <div className="mb-3 text-sm font-medium text-muted-foreground">
            {openForm === 'reply' ? 'Reply' : 'Repost'}
          </div>
          <Suspense>
            <TextNoteForm
              {...(openForm === 'reply' ? { reply: event } : { repost: event })}
              onSuccess={() => {
                setOpenForm(undefined)
              }}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}
