import * as React from "react";

import { NavUser } from "@/components/nav-user";
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
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/AuthContext";
import { Box, LayoutPanelLeft, Trash } from "lucide-react";

// This is sample data
const data = {
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: <LayoutPanelLeft strokeWidth={2} />,
      isActive: true,
    },
    {
      title: "Collection",
      url: "#",
      icon: <Box strokeWidth={2} />,
      isActive: false,
    },
    {
      title: "Trash",
      url: "#",
      icon: <Trash strokeWidth={2} />,
      isActive: false,
    },
  ],
};
export function AppSidebar({ activeTab, onTabChange, ...props }) {
  const { user } = useAuthContext();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="pt-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="md:h-8 md:p-0"
              onClick={() => onTabChange("Home")}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-full text-sidebar-primary-foreground">
                <img src="/mindfolio.png" alt="" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <h1 className="truncate font-semibold text-md">MindFolio</h1>
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
                    onClick={() => onTabChange(item.title)}
                    isActive={activeTab === item.title}
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
        <NavUser
          user={
            user || { name: "Guest", email: "guest@example.com", avatar: "" }
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
