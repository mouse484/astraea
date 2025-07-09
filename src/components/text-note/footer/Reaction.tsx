import type { UseMutationResult } from '@tanstack/react-query'
import type { VerifiedEvent } from 'nostr-tools'
import type { PropsWithChildren } from 'react'
import type { ReactionEventSchema } from '@/lib/nostr/kinds/7'
import { useRouteContext } from '@tanstack/react-router'
import { Button } from '@/shadcn-ui/components/ui/button'
import { cn } from '@/shadcn-ui/utils'

interface Props extends PropsWithChildren {
  content: string
  reactions: typeof ReactionEventSchema.Type[]
  mutation: UseMutationResult<VerifiedEvent, Error, string, unknown>
  activeClassName: string
}

export default function Reaction({
  content,
  reactions,
  mutation: { mutate, isIdle, isSuccess: mutationSuccess },
  children,
  activeClassName,
}: Props) {
  const { pubkey } = useRouteContext({ from: '/(app)' })
  const userReacted = mutationSuccess || reactions.some(
    event => event.pubkey === pubkey.decoded,
  )

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
      {children}
      {reactions.length > 0 && (
        <span className="ml-1 text-xs">{reactions.length}</span>
      )}
    </Button>
  )
}
