import { useQuery } from '@tanstack/react-query'
import { Schema } from 'effect'
import { useMemo } from 'react'
import { getLightningPayEndpoint, LnurlPayResponseWithNIP57Schema } from '../nips/57'

export default function useZap(metadata: { lud06?: string, lud16?: string }) {
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

  return query
}
