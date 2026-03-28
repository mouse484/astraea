import type { z } from 'zod'
import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useNostrEvents } from '@/lib/nostr/hooks/use-nostr-events'
import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import queryKeyList from '@/lib/query-key'
import { Button } from '@/shadcn-ui/components/ui/button'

interface Props {
  event: z.infer<typeof TextNoteEventSchema>
  isOpen?: boolean
  onToggle?: (open: boolean) => void
  setTimelinePaused?: (paused: boolean) => void
}

export default function Reply({ event, isOpen = false, onToggle, setTimelinePaused }: Props) {
  const [localOpen, setLocalOpen] = useState(false)
  const open = onToggle ? isOpen : localOpen

  const handleToggle = (newOpen: boolean) => {
    if (setTimelinePaused) setTimelinePaused(newOpen)
    if (onToggle) {
      onToggle(newOpen)
    } else {
      setLocalOpen(newOpen)
    }
  }

  const items = useNostrEvents(
    queryKeyList.reply(event.id),
    TextNoteEventSchema,
  )
  return (
    <Button
      className={open ? 'text-primary' : ''}
      size="icon"
      variant={open ? 'secondary' : 'ghost'}
      onClick={() => handleToggle(!open)}
    >
      <MessageCircle />
      {items.length > 0 && (
        <span>{items.length}</span>
      )}
    </Button>
  )
}
