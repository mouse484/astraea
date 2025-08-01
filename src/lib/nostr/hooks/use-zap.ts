import { useMutation, useQuery } from '@tanstack/react-query'
import { Schema } from 'effect'
import { useMemo } from 'react'
import { ZapRequestEventSchema } from '../kinds/9734'
import { LnurlPayInvoiceResponseSchema } from '../luds/06'
import { getLightningLnurl, LnurlPayResponseWithNIP57Schema } from '../nips/57'
import { signEvent } from '../utils/sign-event'

export function useZap(metadata: { lud06?: string, lud16?: string }) {
  const lnurl = useMemo(() => getLightningLnurl(metadata), [metadata])

  const query = useQuery({
    queryKey: ['lnurlPayment', lnurl],
    queryFn: async () => {
      if (!lnurl) return
      const response = await fetch(lnurl)
      if (!response.ok) return
      const json = await response.json()
      try {
        const lnurl = Schema.decodeUnknownSync(LnurlPayResponseWithNIP57Schema)(json)
        return lnurl.allowsNostr === true && typeof lnurl.callback === 'string'
          ? { isEnabled: true, lnurlResponse: lnurl }
          : undefined
      } catch {}
    },
    enabled: !!lnurl,
    retry: 1,
  })

  const mutation = useMutation({
    mutationFn: async (
      {
        amount,
        message,
        pubkey,
        relays = [],
        targetEventId,
      }:
      {
        amount: number
        message?: string
        pubkey: string
        relays?: string[]
        targetEventId: string
      }) => {
      if (!query.data?.lnurlResponse?.callback) throw new Error('No callback URL')
      const url = new URL(query.data.lnurlResponse.callback)

      const signedEvent = await signEvent(ZapRequestEventSchema, {
        kind: 9734,
        content: message ?? '',
        tags: [
          ['relays', ...relays],
          ['amount', amount],
          ['lnurl', url.href],
          ['p', pubkey],
          ['e', targetEventId],
        ],
      })

      url.searchParams.set('amount', String(amount * 1000))
      url.searchParams.set('nostr', JSON.stringify(signedEvent))
      url.searchParams.set('lnurl', lnurl!.href)

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch invoice')

      const json = await response.json()
      const invoice = Schema.decodeUnknownSync(LnurlPayInvoiceResponseSchema)(json)

      if ('status' in invoice && invoice.status === 'ERROR') {
        throw new Error(invoice.reason)
      }
      if ('pr' in invoice) {
        return invoice
      }
      throw new Error('No invoice returned')
    },
  })

  return { ...query, mutation }
}
