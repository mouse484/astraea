import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useMutation } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { useState } from 'react'
import { ReactionEventSchema } from '@/lib/nostr/kinds/7'
import useNostr from '@/lib/nostr/use-nostr'
import { Button } from '@/shadcn-ui/components/ui/button'
import { cn } from '@/shadcn-ui/utils'

interface Props {
  event: typeof TextNoteEventSchema.Type
}

export default function Like({ event }: Props) {
  const { queryClient } = useRouteContext({ from: '/(app)' })
  const { publishEvent } = useNostr()
  const [count, setCount] = useState(0)

  const { mutate, isIdle, isSuccess } = useMutation({
    mutationFn: async () => {
      const result = await publishEvent(ReactionEventSchema, {
        kind: 7,
        content: '+',
        tags: [
          ['e', event.id],
          ['p', event.pubkey],
        ],
      })
      setCount(previous => previous + 1)
      return result
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['reaction', event.id, '+'], () => data)
    },
  })

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
      {count > 0 && <span className="ml-1 text-xs">{count}</span>}
    </Button>
  )
}
