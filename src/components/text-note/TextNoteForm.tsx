import { useMutation } from '@tanstack/react-query'
import { SendHorizonal } from 'lucide-react'
import { useState } from 'react'
import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import useNostr from '@/lib/nostr/use-nostr'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Textarea } from '@/shadcn-ui/components/ui/textarea'

interface Props {
  reply?: {
    root: typeof TextNoteEventSchema.Type
  }
  onSuccess?: () => void
}

export default function TextNoteForm({ reply, onSuccess }: Props) {
  const [text, setText] = useState('')
  const { publishEvent } = useNostr()

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      return await publishEvent(TextNoteEventSchema, {
        content,
        kind: 1,
        tags: reply?.root
          ? [
              ['e', reply.root.id, '', 'root'],
              ['p', reply.root.pubkey],
            ]
          : [],
      })
    },
    onSuccess: () => {
      setText('')
      onSuccess?.()
    },
  })

  const handleSubmit = async () => {
    if (text.length <= 0 || mutation.isPending) return
    mutation.mutate(text)
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
          disabled={text.length <= 0 || mutation.isPending}
          onClick={handleSubmit}
        >
          Post
          <SendHorizonal />
        </Button>
      </div>
    </div>
  )
}
