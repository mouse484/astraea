import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useMutation } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { ReactionEventSchema } from '@/lib/nostr/kinds/7'
import useNostr from '@/lib/nostr/use-nostr'
import { useNostrEvents } from '@/lib/nostr/use-nostr-events'
import { Button } from '@/shadcn-ui/components/ui/button'
import { cn } from '@/shadcn-ui/utils'

interface Props {
  event: typeof TextNoteEventSchema.Type
}

export default function Like({ event }: Props) {
  const { queryClient, pubkey } = useRouteContext({ from: '/(app)' })
  const { publishEvent } = useNostr()

  const reactionEvents = useNostrEvents(['reaction', event.id, '+'])

  const { mutate, isIdle, isSuccess: mutationSuccess } = useMutation({
    mutationFn: async () => {
      const result = await publishEvent(ReactionEventSchema, {
        kind: 7,
        content: '+',
        tags: [
          ['e', event.id],
          ['p', event.pubkey],
        ],
      })
      return result
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['reaction', event.id, '+'], data)
    },
  })

  const isSuccess = mutationSuccess || reactionEvents.some(
    event => event.pubkey === pubkey.decoded && event.content === '+',
  )

  return (
    <Button
      className={cn(
        'disabled:opacity-100',
        isSuccess && `
          text-red-400
          [&>svg]:fill-red-400
        `,
      )}
      size="icon"
      variant="ghost"
      disabled={!isIdle && isSuccess}
      onClick={() => mutate()}
    >
      <Heart />
      {reactionEvents.length > 0 && <span className="ml-1 text-xs">{reactionEvents.length}</span>}
    </Button>
  )
}
