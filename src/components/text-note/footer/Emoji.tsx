import type { UseMutationResult } from '@tanstack/react-query'
import type { VerifiedEvent } from 'nostr-tools'
import { SmilePlus } from 'lucide-react'
import { Button } from '@/shadcn-ui/components/ui/button'
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
} from '@/shadcn-ui/components/ui/emoji-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn-ui/components/ui/popover'

interface Props {
  mutation: UseMutationResult<VerifiedEvent, Error, string, unknown>
}

export default function Emoji({ mutation: { mutate } }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
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
