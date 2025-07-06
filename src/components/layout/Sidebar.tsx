import type { LinkProps } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { Link, useRouteContext } from '@tanstack/react-router'
import { Globe, Home, Info, Network, Settings2, User } from 'lucide-react'
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



export default function Sidebar() {
  const pubkey = useRouteContext({ from: '/(app)', select: s => s.pubkey })
  const menuItems = [
    {
      groupName: 'General',
      items: [
        {
          name: 'Home',
          to: '/home',
          icon: Home,
        },
        {
          name: 'Global',
          to: '/global',
          icon: Globe,
        },
      ],
    },
    {
      groupName: 'Settings',
      items: [
        {
          name: 'General',
          to: '/settings/general',
          icon: Settings2,
        },
        {
          name: 'Relays',
          to: '/settings/relays',
          icon: Network,
        },
      ],
    },
    {
      groupName: 'Info',
      items: [
        {
          name: 'About',
          to: '/about',
          icon: Info,
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
              <Link params={{ id: pubkey.routeId }} to="/npub1{$id}">
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
