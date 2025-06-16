import { redirect } from '@tanstack/react-router'
import { nip19 } from 'nostr-tools'
import { createNoteId } from '@/lib/nostr/nip19'

export const Route = createFileRoute({
  loader: async ({ params: { id } }) => {
    const noteID = createNoteId(`note1${id}`)

    const nevent = nip19.neventEncode({ id: noteID.decoded })

    throw redirect({
      to: '/nevent{$id}',
      params: { id: nevent },
    })
  },
})
