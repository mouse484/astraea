import { verifier } from '@rx-nostr/crypto'
import {
  createRxBackwardReq,
  createRxForwardReq,
  createRxNostr,
  nip07Signer,
} from 'rx-nostr'

export const rxNostr = createRxNostr({
  verifier,
  signer: nip07Signer(),
})
export const rxForwardReq = createRxForwardReq()
export const rxBackwardReq = createRxBackwardReq()
