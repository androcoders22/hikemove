"use client";

import * as React from "react";
import { Command } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { adminPaths, memberPaths } from "@/lib/routes";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userType } = useAuthStore();
  const navPaths = userType === "admin" ? adminPaths : memberPaths;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                href={userType === "admin" ? "/admin/dashboard" : "/dashboard"}
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    HikeMove Dashboard
                  </span>
                  <span className="truncate text-xs">
                    Wealth Creation Management
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navPaths} />
        {/* <NavSecondary items={secondaryRoutes} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarSeparator className="my-1" />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
