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
import { Loader2, Command, Eye, EyeOff } from "lucide-react";
import { adminLogin, verifyAdminOtp } from "@/lib/api/admin";
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
  const [showPassword, setShowPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

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

  const handleSendOtp = async () => {
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!email || !password) {
      toast.error("Enter both email and password first");
      return;
    }

    try {
      setIsSendingOtp(true);
      const response = await adminLogin({
        email,
        password,
      });

      if (response?.status !== true) {
        toast.error(response?.message || "Incorrect email or password");
        return;
      }

      setIsOtpFieldVisible(true);
      setOtp("");
      setOtpTimer(60);
      toast.success(response?.message || "OTP sent to your email");
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      if (Array.isArray(serverMessage)) {
        serverMessage.forEach((msg: string) => toast.error(msg));
      } else if (typeof serverMessage === "string") {
        toast.error(serverMessage);
      } else {
        toast.error("Unable to send OTP. Check email/password and try again.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;
    const sanitizedOtp = otp.trim();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!sanitizedOtp) {
      toast.error("Enter the OTP sent to your email");
      return;
    }

    try {
      setLoading(true);

      const otpResponse = await verifyAdminOtp({
        email,
        otp: sanitizedOtp,
      });

      if (otpResponse?.status !== true) {
        toast.error(otpResponse?.message || "Incorrect OTP. Please try again.");
        return;
      }

      const tokenPayload = otpResponse?.data;
      if (tokenPayload?.accessToken) {
        localStorage.setItem("accessToken", tokenPayload.accessToken);
        localStorage.setItem("userType", "admin");
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: tokenPayload?.name || "Admin User",
            email,
            avatar: tokenPayload?.avatar || "/s-traders-logo.webp",
          }),
        );

        toast.success("Logged in successfully");
        router.push("/admin/dashboard");
        return;
      }

      toast.error("OTP verified but login token missing. Please try again.");
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
          <div className="mx-auto flex h-16 w-auto items-center justify-center">
            <img src="/hikemovelogo.png" alt="HikeMove Logo" className="h-26 w-auto object-contain" />
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
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
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
                  Enter the code delivered to your registered email address.
                </p>
              </div>
            )}

            {!isOtpFieldVisible && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
              >
                {isSendingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSendingOtp ? "Sending..." : "Send OTP"}
              </Button>
            )}

            {isOtpFieldVisible && (
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleSendOtp}
                  disabled={(otpTimer > 0) || isSendingOtp}
                >
                  {isSendingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {otpTimer > 0
                    ? `Resend OTP in ${otpTimer}s`
                    : "Resend OTP"}
                </Button>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            )}

            <p className="text-center text-sm text-muted-foreground">
              {/* Reset password?{" "} */}
              <Link href="/admin-forgot-password" className="text-primary font-semibold">
                Forgot Password ?
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
