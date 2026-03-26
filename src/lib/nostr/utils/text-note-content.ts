import { createEvent } from '../nip19'

interface BaseNode<Type extends string, Value = unknown> {
  type: Type
  value: Value
}

type Node = BaseNode<'text', string> | BaseNode<'nevent', ReturnType<typeof createEvent>>

// Matches: nostr:nevent1..., nostr:npub1..., nostr:note1..., nostr:nprofile1..., nostr:naddr1...
const NOSTR_IDENTIFIER_REGEX = /(nostr:(?:nevent1|npub1|note1|nprofile1|naddr1)[a-zA-Z0-9]+)/

const NOSTR_PREFIX_REGEX = /^nostr:/

export function parseTextNoteContent(content: string): Node[] {
  return content.split('\n').flatMap<Node>((line) => {
    // More precise regex pattern for Nostr identifiers
    const parts = line.split(NOSTR_IDENTIFIER_REGEX)

    return parts
      .filter(part => part.length > 0)
      .map((part): Node => {
        if (part.startsWith('nostr:')) {
          try {
            const identifier = part.replace(NOSTR_PREFIX_REGEX, '')
            const event = createEvent(identifier)
            return {
              type: 'nevent',
              value: event,
            }
          } catch (error) {
            console.warn('Failed to parse nostr identifier:', part, error)
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
