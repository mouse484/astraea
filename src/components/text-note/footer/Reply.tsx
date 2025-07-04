import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useNostrEvents } from '@/lib/nostr/use-nostr-events'
import { Button } from '@/shadcn-ui/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shadcn-ui/components/ui/collapsible'
import TextNoteForm from '../TextNoteForm'

interface Props {
  event: typeof TextNoteEventSchema.Type
}

export default function Reply({ event }: Props) {
  const [open, setOpen] = useState(false)

  const items = useNostrEvents(['reply', event.id])
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button size="icon" variant="ghost">
          <MessageCircle />
          {items.length > 0 && (
            <span>{items.length}</span>
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="h-30">
        <div className="absolute mt-4 w-full">
          <TextNoteForm
            reply={{ root: event }}
            onSuccess={() => {
              setOpen(false)
            }}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
