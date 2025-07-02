import type { LucideIcon } from 'lucide-react'
import type { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { useRouter } from '@tanstack/react-router'
import { ClipboardCopy, Link, Share2 } from 'lucide-react'
import { copyToClipboard } from '@/lib/clipboard'
import { createEvent, createNoteId } from '@/lib/nostr/nip19'
import { Button } from '@/shadcn-ui/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn-ui/components/ui/dropdown-menu'

interface Props {
  event: typeof TextNoteEventSchema.Type
}

type MenuItems = {
  icon: LucideIcon
  label: string
  onClick: () => void
}[][]

export default function Share({ event: _event }: Props) {
  const router = useRouter()

  const event = createEvent({
    id: _event.id,
    author: _event.pubkey,
  })
  const noteId = createNoteId(event.decoded.id)

  const neventHref = router.buildLocation({
    to: '/nevent1{$id}',
    params: { id: event.routeId },
  }).href
  const neventUrl = new URL(neventHref, globalThis.location.href).href

  const items: MenuItems = [
    [
      {
        icon: ClipboardCopy,
        label: 'Copy Note ID (note1)',
        onClick: () => {
          copyToClipboard(noteId.encoded)
        },
      },
      {
        icon: ClipboardCopy,
        label: 'Copy Note ID (hex)',
        onClick: () => {
          copyToClipboard(noteId.decoded)
        },
      },
    ],
    [
      {
        icon: Link,
        label: 'Copy Link',
        onClick: () => {
          copyToClipboard(neventUrl)
        },
      },
      {
        icon: Share2,
        label: 'Share Link',
        onClick: () => {
          try {
            navigator.share({
              url: neventUrl,
            })
          } catch (error) {
            console.error('Share failed:', error)
            copyToClipboard(neventUrl)
          }
        },
      },
    ],
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Share2 />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((group, index) => (
          <div key={group[0].label}>
            <DropdownMenuGroup>
              {group.map(({ icon: Icon, label, onClick }) => (
                <DropdownMenuItem key={label} asChild>
                  <button
                    className="w-full"
                    type="button"
                    onClick={onClick}
                  >
                    <Icon />
                    {label}
                  </button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {index < items.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
