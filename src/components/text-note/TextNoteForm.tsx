import { SendHorizonal } from 'lucide-react'
import { useState } from 'react'
import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import useNostr from '@/lib/nostr/use-nostr'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Textarea } from '@/shadcn-ui/components/ui/textarea'

export default function TextNoteForm() {
  const [text, setText] = useState('')
  const { publishEvent } = useNostr()
  return (
    <div>
      <Textarea
        className="resize-none"
        value={text}
        onChange={(event) => {
          setText(event.target.value)
        }}
      />
      <div className="mt-2 flex justify-end">
        <Button
          disabled={text.length === 0}
          onClick={async () => {
            await publishEvent(TextNoteEventSchema, {
              content: text,
              kind: 1,
              tags: [],
            })
            setText('')
          }}
        >
          Post
          <SendHorizonal />
        </Button>
      </div>
    </div>
  )
}
