import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { getUnixTime, subMinutes } from 'date-fns'
import { ms } from 'enhanced-ms'
import { SimplePool } from 'nostr-tools'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { batch } from 'rx-nostr'
import { bufferTime, merge } from 'rxjs'
import queryKeyList from '@/lib/query-key'

import { MetadataEventSchema } from './lib/nostr/kinds/0'
import { rxBackwardReq, rxForwardReq, rxNostr } from './lib/nostr/rx-nostr'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ms('5m'),
      gcTime: ms('1h'),
      retry: 1,
    },
  },
})
const pool = new SimplePool()

merge(
  rxNostr.use(rxForwardReq),
  rxNostr.use(rxBackwardReq.pipe(bufferTime(1000), batch())),
)
  .subscribe(({ event }) => {
    // TODO: kindによってのsetQueryDataの振り分けロジックを検討し改善する
    switch (event.kind) {
      case 0: {
        queryClient.setQueryData(queryKeyList.metadata(event.pubkey), MetadataEventSchema.parse(event))

        break
      }
      case 1: {
        const eventTag = event.tags.find(tag => tag[0] === 'e' && tag[3] === 'reply')
          || event.tags.find(tag => tag[0] === 'e' && tag[3] === 'root')
        if (eventTag) {
          queryClient.setQueryData(queryKeyList.reply(eventTag[1], event.id), event)
        } else {
          queryClient.setQueryData(queryKeyList.textnote(event.id), event)
        }

        break
      }
      case 3: {
        queryClient.setQueryData(queryKeyList.followlist(event.pubkey), event)

        break
      }
      case 7: {
        const targetId = event.tags.find(tag => tag[0] === 'e')?.[1]
        if (targetId !== undefined) {
          queryClient.setQueryData(
            queryKeyList.reaction(targetId, event.pubkey, event.content),
            event,
          )
        }

        break
      }
        // No default
    }
  })

rxForwardReq.emit({
  kinds: [1, 7],
  since: getUnixTime(subMinutes(new Date(), 5)),
})

const context = {
  queryClient,
  pool,
  rxNostr,
  rxForwardReq,
  rxBackwardReq,
} as const

const persister = createAsyncStoragePersister({
  storage: globalThis.localStorage,
})

export type RouterContext = typeof context

// Create a new router instance
const router = createRouter({
  routeTree,
  context,
  defaultPreloadStaleTime: 0, // required for tanstack query
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.querySelector('#root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <>
      <StrictMode>
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
          <RouterProvider router={router} />
        </PersistQueryClientProvider>
      </StrictMode>
    </>,
  )
}
