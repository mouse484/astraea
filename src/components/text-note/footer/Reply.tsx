import { MessageCircle } from 'lucide-react'
import { useNostrEvents } from '@/lib/nostr/use-nostr-events'
import { Button } from '@/shadcn-ui/components/ui/button'

interface Props {
  id: string
}

export default function Reply({ id }: Props) {
  const items = useNostrEvents(['reply', id])
  return (
    <Button size="icon" variant="ghost">
      <MessageCircle />
      {items.length > 0 && (
        <span>{items.length}</span>
      )}
    </Button>
  )
}
