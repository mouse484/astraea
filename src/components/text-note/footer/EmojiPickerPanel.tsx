import type { Picker } from 'emoji-picker-element'
import type { EmojiClickEvent } from 'emoji-picker-element/shared'
import { useEffect, useRef } from 'react'
import 'emoji-picker-element'

interface Props {
  onEmojiSelect: (emoji: string) => void
}

export default function EmojiPickerPanel({ onEmojiSelect }: Props) {
  const emojiPickerRef = useRef<Picker>(null)

  useEffect(() => {
    const element = emojiPickerRef.current
    if (!element) return

    const handleEmojiClick = (event: EmojiClickEvent) => {
      const unicode = event.detail.unicode
      if (unicode === undefined) return
      onEmojiSelect(unicode)
    }

    element.addEventListener('emoji-click', handleEmojiClick)

    return () => {
      element.removeEventListener('emoji-click', handleEmojiClick)
    }
  }, [onEmojiSelect])

  return (
    <emoji-picker
      ref={emojiPickerRef}
      class="[--background:transparent] [--border-size:0]"
      onClick={(event) => {
        event.stopPropagation()
      }}
    />
  )
}
