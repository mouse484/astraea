function _<T extends string>(prefix: T, ...args: unknown[]) {
  return [prefix, ...args]
    .filter(argument => argument !== undefined) as [T, ...unknown[]]
}

const queryKeys = {
  /** Kind / Nostr Events */
  // Kind 0
  metadata: () => _('metadata'),
  // Kind 1
  textnote: (id?: string) => _('textnote', id),
  reply: (targetId?: string, eventId?: string) => _('reply', targetId, eventId),
  // Kind 3
  followlist: () => _('followlist'),
  // Kind 7
  reaction: (targetId?: string, pubkey?: string, content?: string) =>
    _('reaction', targetId, pubkey, content),
  // Kind 10002
  relaylist: () => _('relaylist'),
  /** Other */
  // NIP-05
  nip05: (nip05?: string) => _('nip05', nip05),
}

export type QueryKeyList = ReturnType<typeof queryKeys[keyof typeof queryKeys]>[0]

export default queryKeys
