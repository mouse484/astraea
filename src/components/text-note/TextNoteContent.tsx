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
      {lines.map(({ type, value }) => {
        if (type === 'text') {
          return <p key={value} className="break-words whitespace-pre-wrap">{value}</p>
        }
        if (type === 'nevent') {
          return (
            <NostrEvent
              key={value.decoded.id}
              eventId={value.decoded.id}
              queryOptions={TextNoteQuery}
            >
              {event => (
                <TextNote event={event} isDisplayFooter={false} />
              )}
            </NostrEvent>
          )
        }
        return (<Fragment key={`${type}-${value}`} />)
      })}
    </div>
  )
}
