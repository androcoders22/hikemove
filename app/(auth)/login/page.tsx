"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Command } from "lucide-react";
import { adminLogin } from "@/lib/api/admin";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    import("react-hot-toast").then((mod) => {
      const toast = mod.default;
      if (!credentials.email || !credentials.password) {
        toast.error("Please fill in all fields");
        return;
      }
    });

    if (!credentials.email || !credentials.password) return;

    try {
      setLoading(true);

      const res = await adminLogin({
        email: credentials.email,
        password: credentials.password,
      });

      if (res.status === true && res.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: "Admin User",
            email: credentials.email,
            avatar: "/s-traders-logo.webp",
          }),
        );
        sessionStorage.setItem("token", "123456");

        router.push("/tree-view");
      }
    } catch (err: any) {
      // Global axios interceptor already handles throwing the toast error message
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Command className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Sign in to HikeMove Dashboard
          </CardTitle>
          <CardDescription>
            Enter your credentials to access the Reports Monitoring System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
