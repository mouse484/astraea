import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
} from '@/shadcn-ui/components/ui/emoji-picker'

interface Props {
  onEmojiSelect: (emoji: string) => void
}

export default function EmojiPickerPanel({ onEmojiSelect }: Props) {
  return (
    <EmojiPicker
      className="h-87.5"
      onEmojiSelect={({ emoji }) => {
        onEmojiSelect(emoji)
      }}
    >
      <EmojiPickerSearch />
      <EmojiPickerContent />
    </EmojiPicker>
  )
}
