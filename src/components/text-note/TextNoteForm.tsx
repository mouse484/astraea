import { useMutation } from '@tanstack/react-query'
import { SendHorizonal } from 'lucide-react'
import { useState } from 'react'
import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import useNostr from '@/lib/nostr/use-nostr'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Textarea } from '@/shadcn-ui/components/ui/textarea'

interface Props {
  reply?: typeof TextNoteEventSchema.Type
  onSuccess?: () => void
}
    type Tag = typeof TextNoteEventSchema.Type['tags'][number]

export default function TextNoteForm({ reply, onSuccess }: Props) {
  const [text, setText] = useState('')
  const { publishEvent } = useNostr()

  const buildTags = () => {
    if (!reply) return []

    const replyTags = (reply.tags || []) as Tag[]
    const tags: Tag[] = []
    const pubkeys = new Set([reply.pubkey])

    let rootTag: Tag | undefined

    for (const tag of replyTags) {
      if (tag[0] === 'e' && tag[3] === 'root') {
        rootTag = tag
      } else if (tag[0] === 'p') {
        pubkeys.add(tag[1])
      }
    }

    if (rootTag) {
      tags.push(rootTag, ['e', reply.id, '', 'reply'])
    } else {
      tags.push(['e', reply.id, '', 'root'])
    }

    for (const pubkey of pubkeys) {
      tags.push(['p', pubkey])
    }

    return tags
  }

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      return await publishEvent(TextNoteEventSchema, {
        content,
        kind: 1,
        tags: buildTags(),
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
