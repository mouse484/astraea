import type { DecodedResult } from 'nostr-tools/nip19'
import {
  decode,

  naddrEncode,
  neventEncode,
  noteEncode,
  nprofileEncode,
  npubEncode,
} from 'nostr-tools/nip19'

type Entity = Exclude<DecodedResult['type'], 'nsec' | 'nrelay'>

type Entitydecoded<T extends Entity> = Extract<
  DecodedResult,
  { type: T }
>['data']

type Encoder<T extends Entity> = (decoded: Entitydecoded<T>) => string

function createEntityFactory<T extends Entity>(
  type: T,
  encoder: Encoder<T>,
) {
  return (input: string | Entitydecoded<T>) => {
    let _decoded: Entitydecoded<T>
    let _encoded: string

    if (typeof input === 'string') {
      if (input.startsWith(`${type}1`)) {
        const decoded = decode(input)
        if (decoded.type !== type) {
          throw new Error(`Invalid ${type} format: ${input}`)
        }
        _decoded = decoded.data as Entitydecoded<T>
      } else {
        // npub, note are hex strings
        if (type === 'npub' || type === 'note') {
          _decoded = input as Entitydecoded<T>
        } else {
          throw new Error(
            `Invalid input for ${type}: must be an object or an encoded string.`,
          )
        }
      }
    } else {
      _decoded = input
    }

    function getEncoded() {
      if (!_encoded) {
        _encoded = encoder(_decoded)
      }
      return _encoded
    }

    return {
      get decoded() {
        return _decoded
      },
      get encoded() {
        return getEncoded()
      },
      get routeId() {
        return getEncoded().slice(`${type}1`.length)
      },
    }
  }
}

export const createPubkey = createEntityFactory('npub', npubEncode)
export type Pubkey = ReturnType<typeof createPubkey>
export const createNoteId = createEntityFactory('note', noteEncode)
export type NoteId = ReturnType<typeof createNoteId>
export const createProfile = createEntityFactory('nprofile', nprofileEncode)
export type Profile = ReturnType<typeof createProfile>
export const createEvent = createEntityFactory('nevent', neventEncode)
export type Event = ReturnType<typeof createEvent>
export const createAddr = createEntityFactory('naddr', naddrEncode)
export type Addr = ReturnType<typeof createAddr>
