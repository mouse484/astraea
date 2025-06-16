import { decode, type DecodedResult, noteEncode, npubEncode } from 'nostr-tools/nip19'

type EntityType = Extract<DecodedResult['type'], 'npub' | 'note'>
type Encoder = typeof npubEncode | typeof noteEncode

function createEntityFactory(type: EntityType, encoder: Encoder) {
  return (input: string) => {
    let _hex: string
    let _encoded: string

    if (input.startsWith(`${type}1`)) {
      const decoded = decode(input)
      if (decoded.type !== type) {
        throw new Error(`Invalid ${type} format: ${input}`)
      }
      _hex = decoded.data
    } else {
      _hex = input
    }

    function encode() {
      if (!_encoded) {
        _encoded = encoder(_hex)
      }
      return _encoded
    }

    return {
      get decoded() {
        return _hex
      },
      get encoded() {
        return encode()
      },
      get routeId() {
        return encode().slice(`${type}1`.length)
      },
    }
  }
}

export const createPubkey = createEntityFactory('npub', npubEncode)
export type Pubkey = ReturnType<typeof createPubkey>
export const createNoteId = createEntityFactory('note', noteEncode)
export type NoteId = ReturnType<typeof createNoteId>
