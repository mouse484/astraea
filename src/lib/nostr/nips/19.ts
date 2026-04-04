import { nip19 } from 'nostr-tools'
import * as z from 'zod'

type Nip19Type = ReturnType<typeof nip19.decode>['type']

function isValid(type: Nip19Type, s: string): boolean {
  try {
    const decoded = nip19.decode(s)
    return decoded.type === type
  } catch {
    return false
  }
}

// export const NpubSchema = z.string().refine(
//   s => isValid('npub', s),
//   { message: 'Invalid npub format' },
// )

export const NoteIDSchema = z.string().trim().refine(
  s => isValid('note', s),
  { error: 'Invalid note format' },
)

export const NostrtEventAddressSchema = z.string().trim().refine(
  s => isValid('nevent', s),
  { error: 'Invalid nevent format' },
)
