import { Fragment } from 'react'
import { TextNoteQuery } from '@/lib/nostr/kinds/1'
import { parseTextNoteContent } from '@/lib/nostr/utils/text-note-content'
import NostrEvent from '../NostrEvent'
import TextNote from './TextNote'

interface Props {
  content: string
}

export default function TextNoteContent({ content }: Props) {
  const lines = parseTextNoteContent(content)

  return (
    <div className="space-y-2">
      {lines.map(({ type, value }, index) => {
        const key = `${type}-${String(value)}-${Number(index)}`

        if (type === 'text') {
          return (
            <p
              key={key}
              className="wrap-break-word whitespace-pre-wrap"
            >
              {value}
            </p>
          )
        } else if (type === 'nevent') {
          return (
            <NostrEvent
              key={key}
              queryFunction={TextNoteQuery}
              queryOptions={[
                value.decoded.id,
                ({ setKey, id }) => setKey(id),
                { relays: value.decoded.relays },
              ]}
            >
              {event => (
                <TextNote event={event} isDisplayFooter={false} />
              )}
            </NostrEvent>
          )
        }
        return (<Fragment key={key} />)
      })}
    </div>
  )
}
