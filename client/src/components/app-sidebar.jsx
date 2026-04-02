import * as React from "react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { InboxIcon, FileIcon, SentIcon, ArchiveIcon, Delete02Icon, CommandIcon } from "@hugeicons/core-free-icons"
import { useAuthContext } from "@/context/AuthContext"

// This is sample data
const data = {
  navMain: [
    {
      title: "Inbox",
      url: "#",
      icon: (
        <HugeiconsIcon icon={InboxIcon} strokeWidth={2} />
      ),
      isActive: true,
    },
    {
      title: "Drafts",
      url: "#",
      icon: (
        <HugeiconsIcon icon={FileIcon} strokeWidth={2} />
      ),
      isActive: false,
    },
    {
      title: "Sent",
      url: "#",
      icon: (
        <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
      ),
      isActive: false,
    },
    {
      title: "Junk",
      url: "#",
      icon: (
        <HugeiconsIcon icon={ArchiveIcon} strokeWidth={2} />
      ),
      isActive: false,
    },
    {
      title: "Trash",
      url: "#",
      icon: (
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
      ),
      isActive: false,
    },
  ],
}
export function AppSidebar({
  ...props
}) {
  const { user } = useAuthContext()
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pt-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="md:h-8 md:p-0" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <HugeiconsIcon icon={CommandIcon} strokeWidth={2} className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => setActiveItem(item)}
                    isActive={activeItem?.title === item.title}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || { name: "Guest", email: "guest@example.com", avatar: "" }} />
      </SidebarFooter>
    </Sidebar>
  );
}
