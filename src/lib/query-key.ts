function _<T extends string>(prefix: T, ...args: (string | undefined)[]) {
  return [prefix, ...args]
    .filter(argument => argument !== undefined) as [T, ...string[]]
}

const queryKeyList = {
  /** Kind / Nostr Events */
  // Kind 0
  metadata: (pubkey?: string) => _('metadata', pubkey),
  // Kind 1
  textnote: (id?: string) => _('textnote', id),
  reply: (targetId?: string, eventId?: string) => _('reply', targetId, eventId),
  // Kind 3
  followlist: (pubkey?: string) => _('followlist', pubkey),
  // Kind 7
  reaction: (targetId?: string, pubkey?: string, content?: string) =>
    _('reaction', targetId, pubkey, content),
  // Kind 10002
  relaylist: (id?: string) => _('relaylist', id),
  /** Other */
  // NIP-05
  nip05: (nip05?: string) => _('nip05', nip05),
}

export type QueryKeyList = typeof queryKeyList
export type QueryKeyListName = ReturnType<typeof queryKeyList[keyof typeof queryKeyList]>[0]

export default queryKeyList
