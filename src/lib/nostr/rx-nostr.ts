import { verifier } from '@rx-nostr/crypto'
import { createRxBackwardReq, createRxForwardReq, createRxNostr, nip07Signer } from 'rx-nostr'

export const rxNostr = createRxNostr({ verifier })

export const rxForwardReq = createRxForwardReq()
export const rxBackwardReq = createRxBackwardReq()

export const signer = nip07Signer()
