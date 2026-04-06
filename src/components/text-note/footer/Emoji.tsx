import type { UseMutationResult } from '@tanstack/react-query'
import type { Event } from 'nostr-typedef'
import { SmilePlus } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn-ui/components/ui/popover'

const EmojiPickerPanel = lazy(async () => import('./EmojiPickerPanel.tsx'))

interface Props {
  mutation: UseMutationResult<Event, Error, string, unknown>
  setTimelinePaused?: (paused: boolean) => void
}

export default function Emoji({ mutation: { mutate }, setTimelinePaused }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (setTimelinePaused) setTimelinePaused(nextOpen)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
        >
          <SmilePlus />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {open
          ? (
              <Suspense>
                <EmojiPickerPanel
                  onEmojiSelect={(emoji: string) => {
                    mutate(emoji)
                  }}
                />
              </Suspense>
            )
          : undefined}
      </PopoverContent>
    </Popover>
  )
}
