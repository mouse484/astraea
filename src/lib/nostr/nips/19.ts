import { nip19 } from 'nostr-tools'
import { z } from 'zod'

type Nip19Type = ReturnType<typeof nip19.decode>['type']

function isValid(type: Nip19Type, s: string): boolean {
  try {
    const decoded = nip19.decode(s)
    return decoded.type === type
  } catch {
    return false
  }
}

export const NpubSchema = z.string().refine(
  s => isValid('npub', s),
  { message: 'Invalid npub format' },
)

export const NoteIDSchema = z.string().refine(
  s => isValid('note', s),
  { message: 'Invalid note format' },
)

export const NostrtEventAddressSchema = z.string().refine(
  s => isValid('nevent', s),
  { message: 'Invalid nevent format' },
)
