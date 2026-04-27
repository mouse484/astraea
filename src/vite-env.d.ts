/// <reference types="vite/client" />

import type { Picker } from 'emoji-picker-element'
import type { WindowNostr } from 'nostr-tools/nip07'

declare global {
  // eslint-disable-next-line import/no-mutable-exports, no-var
  export var nostr: WindowNostr | undefined
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'emoji-picker': React.DetailedHTMLProps<React.HTMLAttributes<Picker> & { class?: string }, Picker>
    }
  }
}

export {}
