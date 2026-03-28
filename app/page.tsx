"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const userType =
      typeof window !== "undefined" ? localStorage.getItem("userType") : null;

    if (token) {
      if (userType === "admin") {
        router.replace("/admin/tree-view");
      } else {
        router.replace("/dashboard");
      }
    } else {
      router.replace("/member-login");
    }
  }, [router]);

  return null;
}
