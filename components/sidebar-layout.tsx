"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { adminRefresh } from "@/lib/api/admin";
import { memberRefresh } from "@/lib/api/member";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { adminPaths, memberPaths } from "@/lib/routes";
import { getCoinPaymentSettingsAPI } from "@/lib/api/configuration";

const ADMIN_HOME_PATH = "/admin/dashboard";
const MEMBER_HOME_PATH = "/dashboard";

const isPathAllowed = (pathname: string, userType: "admin" | "member") => {
  const allowedPaths = userType === "admin" ? adminPaths : memberPaths;
  const extraAllowed =
    userType === "admin"
      ? [ADMIN_HOME_PATH]
      : [MEMBER_HOME_PATH, "/edit-profile"];

  return (
    allowedPaths.some((group) =>
      group.items.some((item) => pathname.startsWith(item.url)),
    ) || extraAllowed.some((path) => pathname.startsWith(path)) || pathname === "/edit-profile"
  );
};

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentUserType, setCurrentUserType] = useState<
    "admin" | "member" | null
  >(null);
  const [coinDisplay, setCoinDisplay] = useState({
    coinName: "Coin",
    coinSymbol: "",
    coinPrice: "--",
  });
  const { setUserType } = useAuthStore();
  const isAuthRoute =
    pathname.startsWith("/admin-login") ||
    pathname.startsWith("/member-login") ||
    pathname.startsWith("/member-signup");


  useEffect(() => {
    const initSession = async () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("accessToken");
      const userType =
        (localStorage.getItem("userType") as "member" | "admin" | null) ||
        "member";
      
      // Fix: Determine redirect login path based on the current URL
      // If user is trying to access /admin/*, redirect to /admin-login
      // Otherwise, redirect to /member-login
      const isAdminRoute = pathname.startsWith("/admin");
      const loginPath = isAdminRoute ? "/admin-login" : "/member-login";

      if (!token) {
        setCurrentUserType(null);
        setIsInitializing(false);
        router.push(loginPath);
        return;
      }

      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const isExpired = payload.exp * 1000 < Date.now();

          if (isExpired) {
            const refreshFn =
              userType === "member" ? memberRefresh : adminRefresh;
            const res = await refreshFn();
            if (res.status === true && res.data?.accessToken) {
              localStorage.setItem("accessToken", res.data.accessToken);
            } else {
              throw new Error("Invalid session");
            }
          }
        }
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        setCurrentUserType(null);
        setUserType(null);
        router.push(loginPath);
        return;
      } finally {
        setCurrentUserType(userType as "admin" | "member");
        setUserType(userType as "admin" | "member");
        if (!isPathAllowed(pathname, userType as "admin" | "member")) {
          router.push(userType === "admin" ? ADMIN_HOME_PATH : MEMBER_HOME_PATH);
        } else {
          setIsInitializing(false);
        }
      }
    };

    initSession();
  }, [pathname, router]);

  useEffect(() => {
    if (currentUserType !== "member") {
      return;
    }

    let isMounted = true;

    const fetchCoinSetting = async () => {
      try {
        const appSettingRes = await getCoinPaymentSettingsAPI();
        const coinSetting = appSettingRes?.data?.data?.coinSetting;
        if (coinSetting && isMounted) {
          setCoinDisplay({
            coinName: coinSetting.coinName || "Coin",
            coinSymbol: coinSetting.coinSymbol || "",
            coinPrice: String(coinSetting.coinPrice ?? "--"),
          });
        }
      } catch {
        // keep fallback display values if app-setting is unavailable
      }
    };

    fetchCoinSetting();

    return () => {
      isMounted = false;
    };
  }, [currentUserType]);

  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      {!isAuthRoute && currentUserType === "member" ? (
        <div className="fixed top-2 right-4 z-50 pt-2">
          <div className="rounded-full border border-primary/30 bg-background px-3 py-1.5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">
              Live Coin Value
            </p>
            <p className="mt-1 text-xs font-black text-foreground leading-none whitespace-nowrap">
              {coinDisplay.coinName}
              {coinDisplay.coinSymbol ? ` (${coinDisplay.coinSymbol})` : ""}: $ {coinDisplay.coinPrice}
            </p>
          </div>
        </div>
      ) : null}
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
