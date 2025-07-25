import { useMutation, useQuery } from '@tanstack/react-query'
import { Schema } from 'effect'
import { useMemo } from 'react'
import { LnurlPayInvoiceErrorResponseSchema, LnurlPayInvoiceResponseSchema } from '../luds/06'
import { getLightningPayEndpoint, LnurlPayResponseWithNIP57Schema } from '../nips/57'

export function useZap(metadata: { lud06?: string, lud16?: string }) {
  const endpoint = useMemo(() => getLightningPayEndpoint(metadata), [metadata])

  const query = useQuery({
    queryKey: ['lnurlPayment', endpoint],
    queryFn: async () => {
      if (!endpoint) return
      const response = await fetch(endpoint)
      if (!response.ok) return
      const json = await response.json()
      try {
        const lnurl = Schema.decodeUnknownSync(LnurlPayResponseWithNIP57Schema)(json)
        return lnurl.allowsNostr === true && typeof lnurl.callback === 'string'
          ? { isEnabled: true, lnurlResponse: lnurl }
          : undefined
      } catch {}
    },
    enabled: !!endpoint,
    retry: 1,
  })

  const mutation = useMutation({
    mutationFn: async (
      { amount, message, pubkey }: { amount: number, message?: string, pubkey?: string }) => {
      if (!query.data?.lnurlResponse?.callback) throw new Error('No callback URL')
      const callbackUrl = query.data.lnurlResponse.callback
      const urlObject = new URL(callbackUrl)
      urlObject.searchParams.set('amount', String(amount * 1000))
      if (message) urlObject.searchParams.set('comment', message)
      if (pubkey) urlObject.searchParams.set('nostrPubkey', pubkey)
      const response = await fetch(urlObject)
      if (!response.ok) throw new Error('Failed to fetch invoice')
      const json = await response.json()
      if (json.status === 'ERROR') {
        const error = Schema.decodeUnknownSync(LnurlPayInvoiceErrorResponseSchema)(json)
        throw new Error(error.reason)
      }
      const invoice = Schema.decodeUnknownSync(LnurlPayInvoiceResponseSchema)(json)
      if (!invoice.pr) throw new Error('No invoice returned')
      return invoice
    },
  })

  return { ...query, mutation }
}
