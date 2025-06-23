import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { ms } from 'enhanced-ms'
import { SimplePool } from 'nostr-tools'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

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

const context = {
  queryClient,
  pool,
} as const

const persister = createSyncStoragePersister({
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
