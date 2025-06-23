/// <reference types="vite/client" />

import type { WindowNostr } from 'nostr-tools/nip07'

declare global {
  // eslint-disable-next-line import/no-mutable-exports, no-var
  export var nostr: WindowNostr | undefined
}

export {}
