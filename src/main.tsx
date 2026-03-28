import type { Event } from 'nostr-typedef'
import { BasicIndex, createCollection } from '@tanstack/db'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { ms } from 'enhanced-ms'
import { SimplePool } from 'nostr-tools'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
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
const events = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['events'],
    queryFn: () => {
      return [] as Event[]
    },
    getKey: item => item.id,
    defaultIndexType: BasicIndex,
    autoIndex: 'eager',
  }),
)
events.startSyncImmediate()

const context = {
  queryClient,
  pool,
  rxNostr,
  rxForwardReq,
  rxBackwardReq,
  events,
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
