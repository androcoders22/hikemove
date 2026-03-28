"use client";

import { useState } from "react";
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
import toast from "react-hot-toast";
import { Mail, Loader2, Eye, EyeOff } from "lucide-react";
import {
  requestAdminPasswordOtp,
  resetAdminPassword,
} from "@/lib/api/admin";

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    if (!otpStep) {
      setIsSubmitting(true);
      try {
        const response = await requestAdminPasswordOtp({
          email: normalizedEmail,
        });

        if (response?.status !== true) {
          toast.error(response?.message || "Failed to send OTP");
          return;
        }

        toast.success(response?.message || "OTP sent to your admin email");
        setOtpStep(true);
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        if (!serverMessage) {
          toast.error("Unable to send OTP");
        }
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Enter OTP and both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetAdminPassword({
        email: normalizedEmail,
        otp: otp.trim(),
        newPassword,
      });

      if (response?.status !== true) {
        toast.error(response?.message || "Password reset failed");
        return;
      }

      toast.success(response?.message || "Password reset successfully");
      router.push("/admin-login");
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message;
      if (!serverMessage) {
        toast.error("Unable to reset password");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Password Reset</CardTitle>
          <CardDescription>
            Enter the admin email to receive an OTP and set a new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {otpStep && (
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  inputMode="numeric"
                  maxLength={6}
                  required
                />
              </div>
            )}

            {otpStep && (
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                    aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {otpStep && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting
                ? otpStep
                  ? "Submitting..."
                  : "Sending..."
                : otpStep
                  ? "Submit"
                  : "Send Reset Request"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Remembered the password?{" "}
            <Link href="/admin-login" className="text-primary font-semibold">
              Back to Admin Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
