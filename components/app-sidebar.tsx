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
            <SidebarMenuButton size="lg" asChild className="h-24 hover:bg-transparent active:bg-transparent">
              <a
                href={userType === "admin" ? "/admin/tree-view" : "/dashboard"}
                className="flex items-center gap-3 px-2"
              >
                <img
                  src="/hikemovelogo.png"
                  alt="HikeMove Logo"
                  className="h-32 w-full object-contain brightness-100"
                />
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
