import { useMutation } from '@tanstack/react-query'
import { SendHorizonal } from 'lucide-react'
import { useState } from 'react'
import useNostr from '@/lib/nostr/hooks/use-nostr'
import { TextNoteEventSchema } from '@/lib/nostr/kinds/1'
import { createEvent } from '@/lib/nostr/nip19'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Textarea } from '@/shadcn-ui/components/ui/textarea'
import ContentWarningForm from './ContentWarningForm'

interface Props {
  reply?: typeof TextNoteEventSchema.Type
  repost?: typeof TextNoteEventSchema.Type
  onSuccess?: () => void
}

type Tag = typeof TextNoteEventSchema.Type['tags'][number]

export default function TextNoteForm({ reply, repost, onSuccess }: Props) {
  const [text, setText] = useState('')
  const [contentWarning, setContentWarning] = useState<false | true | string>(false)
  const { publishEvent } = useNostr()

  const buildTags = () => {
    const tags: Tag[] = []

    if (contentWarning !== false) {
      if (typeof contentWarning === 'string' && contentWarning.length > 0) {
        tags.push(['content-warning', contentWarning])
      } else if (contentWarning === true) {
        tags.push(['content-warning'])
      }
    }

    if (repost) {
      tags.push(
        ['q', repost.id, '', repost.pubkey],
        ['p', repost.pubkey],
      )
      return tags
    }

    if (!reply) return tags

    const replyTags = (reply.tags || []) as Tag[]
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
      if (repost) {
        const nevent = `nostr:${createEvent({
          id: repost.id,
          kind: repost.kind,
          author: repost.pubkey,
        }).encoded}`
        const quotedContent = content.length > 0 ? `${content}\n\n${nevent}` : nevent
        return await publishEvent(TextNoteEventSchema, {
          content: quotedContent,
          kind: 1,
          tags: buildTags(),
        })
      } else {
        return await publishEvent(TextNoteEventSchema, {
          content,
          kind: 1,
          tags: buildTags(),
        })
      }
    },
    onSuccess: () => {
      setText('')
      setContentWarning(false)
      onSuccess?.()
    },
  })

  const handleSubmit = async () => {
    if ((text.length <= 0 && !repost) || mutation.isPending) return
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
        className="resize-none break-all"
        name="text note form"
        value={text}
        onChange={(event) => {
          setText(event.target.value)
        }}
        onKeyDown={handleKeyDown}
      />
      <div className="mt-2 flex justify-between">
        <ContentWarningForm
          value={contentWarning}
          onChange={setContentWarning}
        />
        <Button
          disabled={(text.length <= 0 && !repost) || mutation.isPending}
          onClick={handleSubmit}
        >
          Post
          <SendHorizonal />
        </Button>
      </div>
    </div>
  )
}
