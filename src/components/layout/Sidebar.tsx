import type { Pubkey } from '@/lib/nostr/nip19'
import { Link, type LinkProps } from '@tanstack/react-router'
import { Home, type LucideIcon, Network, User } from 'lucide-react'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shadcn-ui/components/ui/sidebar'

export { SidebarProvider } from '@/shadcn-ui/components/ui/sidebar'

interface Props {
  pubkey: Pubkey
}

export default function Sidebar({ pubkey }: Props) {
  const menuItems = [
    {
      groupName: 'General',
      items: [
        {
          name: 'Home',
          to: '/home',
          icon: Home,
        },
      ],
    },
    {
      groupName: 'Settings',
      items: [
        {
          name: 'Relays',
          to: '/settings/relays',
          icon: Network,
        },
      ],
    },
  ] satisfies {
    groupName: string
    items: {
      name: string
      to: LinkProps['to']
      icon: LucideIcon
    }[]
  }[]

  return (
    <ShadcnSidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            Astraea
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map(group => (
          <SidebarGroup key={group.groupName}>
            <SidebarGroupLabel>
              {group.groupName}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link to={item.to}>
                        <item.icon />
                        {item.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/npub1{$id}" params={{ id: pubkey.routeId }}>
                <User />
                Profile
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  )
}
