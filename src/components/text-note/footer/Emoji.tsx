import type { UseMutationResult } from '@tanstack/react-query'
import type { VerifiedEvent } from 'nostr-tools'
import { SmilePlus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shadcn-ui/components/ui/button'
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
} from '@/shadcn-ui/components/ui/emoji-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn-ui/components/ui/popover'

interface Props {
  mutation: UseMutationResult<VerifiedEvent, Error, string, unknown>
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
        <EmojiPicker
          className="h-[350px]"
          onEmojiSelect={({ emoji }) => {
            mutate(emoji)
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  )
}
