import type { PropsWithChildren } from 'react'
import Sidebar, { SidebarProvider } from '@/components/layout/Sidebar'

interface Props extends PropsWithChildren {}
export function Layout({ children }: Props) {
  return (
    <div className="max-w-svw overflow-x-hidden">
      <SidebarProvider>
        <Sidebar />
        <main className="h-svh w-full space-y-8 p-8">
          {children}
        </main>
      </SidebarProvider>
    </div>
  )
}
