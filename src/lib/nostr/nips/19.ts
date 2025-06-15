import { Schema } from 'effect'
import { nip19 } from 'nostr-tools'

type Nip19Type = ReturnType<typeof nip19.decode>['type']

function isVaild(type: Nip19Type, s: string): boolean {
  try {
    const decoded = nip19.decode(s)
    return decoded.type === type
  } catch {
    return false
  }
}

export const NpubSchema = Schema.String.pipe(
  Schema.filter(s => isVaild('npub', s)),
)

export const NoteIDSchema = Schema.String.pipe(
  Schema.filter(s => isVaild('note', s)),
)

export const NostrtEventAddressSchema = Schema.String.pipe(
  Schema.filter(s => isVaild('nevent', s)),
)
