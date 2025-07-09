import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { Repeat2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shadcn-ui/components/ui/button'

interface Props {
  event: typeof TextNoteEventSchema.Type
  isOpen?: boolean
  onToggle?: (open: boolean) => void
}

export default function Repost({ event: _event, isOpen = false, onToggle }: Props) {
  const [localOpen, setLocalOpen] = useState(false)
  const open = onToggle ? isOpen : localOpen

  const handleToggle = (newOpen: boolean) => {
    if (onToggle) {
      onToggle(newOpen)
    } else {
      setLocalOpen(newOpen)
    }
  }

  return (
    <Button
      className={open ? 'text-primary' : ''}
      size="icon"
      variant={open ? 'secondary' : 'ghost'}
      onClick={() => handleToggle(!open)}
    >
      <Repeat2 />
    </Button>
  )
}
