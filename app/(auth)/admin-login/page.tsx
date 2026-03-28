"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpFieldVisible, setIsOtpFieldVisible] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  useEffect(() => {
    if (!otpTimer) return;
    const timer = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpTimer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendOtp = () => {
    if (!credentials.email.trim()) {
      toast.error("Enter the admin email first");
      return;
    }
    setIsOtpFieldVisible(true);
    setOtp("");
    setOtpTimer(60);
    toast.success("Demo OTP sent—API hookup coming soon");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await adminLogin({
        email,
        password,
      });

      if (res.status === true && res.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("userType", "admin");
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: "Admin User",
            email,
            avatar: "/s-traders-logo.webp",
          }),
        );

        router.push("/admin/tree-view");
      } else {
        toast.error(res?.message || "Invalid credentials");
      }
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      if (Array.isArray(serverMessage)) {
        serverMessage.forEach((msg: string) => toast.error(msg));
      } else if (typeof serverMessage === "string") {
        toast.error(serverMessage);
      } else {
        toast.error("Login failed");
      }
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

            {isOtpFieldVisible && (
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6 digit OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                />
                <p className="text-[11px] text-muted-foreground">
                  OTP verification will activate once the mail API is connected.
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleSendOtp}
              disabled={isOtpFieldVisible && otpTimer > 0}
            >
              {isOtpFieldVisible
                ? otpTimer > 0
                  ? `Resend OTP in ${otpTimer}s`
                  : "Resend OTP"
                : "Send OTP"}
            </Button>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Forgot password?{" "}
              <Link href="/admin-forgot-password" className="text-primary font-semibold">
                Reset here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
