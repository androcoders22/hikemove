"use client";

import { LogOut } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser() {
  const handleLogout = () => {
    const userType = localStorage.getItem("userType");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    const loginPath = userType === "member" ? "/member-login" : "/admin-login";
    window.location.href = loginPath;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          onClick={handleLogout}
          className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="flex-1 text-left text-sm font-medium">Logout</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
