import type { UseMutationResult } from '@tanstack/react-query'
import type { Event } from 'nostr-typedef'
import type * as z from 'zod'
import type { ReactionEventSchema } from '@/lib/nostr/kinds/7'
import { useRouteContext } from '@tanstack/react-router'
import { HeartIcon } from 'lucide-react'
import { Button } from '@/shadcn-ui/components/ui/button'
import { cn } from '@/shadcn-ui/lib/utils'

interface Props {
  content: string
  reactions: z.infer<typeof ReactionEventSchema>[]
  mutation: UseMutationResult<Event, Error, string, unknown>
  activeClassName: string
}

export default function Reaction({
  content,
  reactions,
  mutation: { mutate, isIdle, isSuccess: mutationSuccess },
  activeClassName,
}: Props) {
  const { pubkey } = useRouteContext({ from: '/(app)' })
  const userReacted = mutationSuccess || reactions.some(
    event => event.pubkey === pubkey.decoded,
  )

  const renderCustomEmojiReaction = () => {
    if (content === '+') {
      return <HeartIcon />
    }

    if (!content.startsWith(':') || !content.endsWith(':') || content.length <= 2) {
      return content
    }

    const shortcode = content.slice(1, -1)

    for (const event of reactions) {
      for (const tag of event.tags) {
        if (tag[0] === 'emoji' && tag[1] === shortcode && typeof tag[2] === 'string') {
          return <img className="size-4" alt={shortcode} src={tag[2]} />
        }
      }
    }

    return content
  }

  return (
    <Button
      className={cn(
        'disabled:opacity-100',
        userReacted && (activeClassName),
      )}
      size="icon"
      variant="ghost"
      disabled={!isIdle || userReacted}
      onClick={() => mutate(content)}
    >
      {renderCustomEmojiReaction()}
      {reactions.length > 0 && (
        <span className="ml-1 text-xs">{reactions.length}</span>
      )}
    </Button>
  )
}
