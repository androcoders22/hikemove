"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Loader2 } from "lucide-react";
import { memberLogin } from "@/lib/api/member";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MemberLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [isOpeningPdf, setIsOpeningPdf] = useState(false);
  const pdfTimerRef = useRef<number | null>(null);
  const [credentials, setCredentials] = useState({
    memberId: "",
    password: "",
  });
  const businessPdfUrl = "/business-value.pdf";

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
      if (!credentials.memberId || !credentials.password) {
        toast.error("Please fill in all fields");
        return;
      }
    });

    if (!credentials.memberId || !credentials.password) return;

    try {
      setLoading(true);

      const res = await memberLogin({
        memberId: credentials.memberId,
        password: credentials.password,
      });

      if (res.status === true && res.data?.accessToken) {
        const userData = res.data.user || res.data;
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("userType", "member");
        localStorage.setItem("user", JSON.stringify(userData));
        // Always store the typed memberId — it's guaranteed to be the login ID
        localStorage.setItem("memberId", credentials.memberId);

        // Redirect to member dashboard or home after login
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    if (value === "business") {
      setIsOpeningPdf(true);
      window.open(businessPdfUrl, "_blank", "noopener,noreferrer");

      if (pdfTimerRef.current) {
        window.clearTimeout(pdfTimerRef.current);
      }

      pdfTimerRef.current = window.setTimeout(() => {
        setIsOpeningPdf(false);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-auto items-center justify-center">
            <img src="/hikemovelogo.png" alt="HikeMove Logo" className="h-26 w-auto object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">Member Login In</CardTitle>
          <CardDescription>
            Enter your Member ID and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="business">Business Value</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="memberId">Member ID</Label>
                  <Input
                    id="memberId"
                    name="memberId"
                    type="text"
                    value={credentials.memberId}
                    onChange={handleInputChange}
                    placeholder="Enter your Member ID"
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

                <p className="text-center text-sm text-muted-foreground">
                  Forgot password?{" "}
                  <Link href="/member-forgot-password" className="text-primary font-semibold">
                    Reset here
                  </Link>
                </p>

                <div className="text-center text-sm text-muted-foreground mt-4">
                  Don't have an account?{" "}
                  <Link
                    href="/member-signup/default"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="business" className="mt-4 space-y-3">
              <div className="rounded-lg border bg-muted/40 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                  {isOpeningPdf && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>
                    {isOpeningPdf
                      ? "Opening Business Value PDF..."
                      : "Business Value PDF opened in a new tab."}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  If it did not open, use the button below to try again.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => window.open(businessPdfUrl, "_blank", "noopener,noreferrer")}
              >
                Open Business Value PDF
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
