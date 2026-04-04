import type { RouterContext } from '@/main'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, HeadContent, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ThemeProvider } from 'next-themes'
import { Button } from '@/shadcn-ui/components/ui/button'
import { Toaster } from '@/shadcn-ui/components/ui/sonner'
import '../globals.css'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    links: [
      {
        rel: 'icon',
        href: '/icon.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.webmanifest',
      },
    ],
    meta: [
      {
        name: 'theme-color',
        content: '#f0b100',
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes',
      },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <ThemeProvider attribute="class">
        <Outlet />
        <Toaster />
      </ThemeProvider>
      <TanStackDevtools
        plugins={[
          { name: 'TanStack Query', render: <ReactQueryDevtoolsPanel /> },
          { name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> },
          formDevtoolsPlugin(),
        ]}
      />
    </>
  ),
  notFoundComponent: () => (
    <div className={`
      grid h-svh w-svw place-content-center place-items-center gap-8
    `}
    >
      <h1 className="text-4xl">404</h1>
      <Button asChild variant="outline">
        <Link to="/">Back to Top</Link>
      </Button>
    </div>
  ),
})
