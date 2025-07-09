import { createEvent } from '../nip19'

interface BaseNode<Type extends string, Value = unknown> {
  type: Type
  value: Value
}

type Node = BaseNode<'text', string> | BaseNode<'nevent', ReturnType<typeof createEvent>>

export function parseTextNoteContent(content: string): Node[] {
  return content.split('\n').flatMap<Node>((line) => {
    const parts = line.split(/(nostr:\S+)/)

    return parts
      .filter(part => part.length > 0)
      .map((part): Node => {
        if (part.startsWith('nostr:')) {
          const event = createEvent(part.replace(/^nostr:/, ''))
          if (event) {
            return {
              type: 'nevent',
              value: event,
            }
          }
        }
        return {
          type: 'text',
          value: part.trim(),
        }
      })
      .filter((node): node is Node => node.value !== '')
  })
}
