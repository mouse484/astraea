import { verifier } from '@rx-nostr/crypto'
import { createRxBackwardReq, createRxForwardReq, createRxNostr } from 'rx-nostr'

export const rxNostr = createRxNostr({ verifier })

export const rxForwardReq = createRxForwardReq()
export const rxBackwardReq = createRxBackwardReq()
