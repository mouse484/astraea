import { SendHorizonal } from 'lucide-react'
import { useState } from 'react'
import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import useNostr from '@/lib/nostr/use-nostr'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Textarea } from '@/shadcn-ui/components/ui/textarea'

export default function TextNoteForm() {
  const [text, setText] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const { publishEvent } = useNostr()

  const handleSubmit = async () => {
    if (text.length <= 0 || isPosting) return

    setIsPosting(true)
    await publishEvent(TextNoteEventSchema, {
      content: text,
      kind: 1,
      tags: [],
    })
    setText('')
    setIsPosting(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div>
      <Textarea
        className="resize-none"
        value={text}
        onChange={(event) => {
          setText(event.target.value)
        }}
        onKeyDown={handleKeyDown}
      />
      <div className="mt-2 flex justify-end">
        <Button
          disabled={text.length <= 0 || isPosting}
          onClick={handleSubmit}
        >
          Post
          <SendHorizonal />
        </Button>
      </div>
    </div>
  )
}
