"use client";

import { useState } from "react";
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
import toast from "react-hot-toast";
import { ShieldQuestion, Loader2 } from "lucide-react";
import { requestMemberPasswordOtp, resetMemberPassword } from "@/lib/api/member";

export default function MemberForgotPasswordPage() {
  const [memberId, setMemberId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedMemberId = memberId.trim().toUpperCase();

    if (!otpStep) {
      if (!cleanedMemberId) {
        toast.error("Please enter your Member ID");
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await requestMemberPasswordOtp({
          memberId: cleanedMemberId,
        });

        if (response?.status !== true) {
          toast.error(response?.message || "Failed to send OTP");
          return;
        }

        toast.success(response?.message || "OTP sent to your registered email");
        setOtpStep(true);
      } catch (error: any) {
        const serverMessage = error?.response?.data?.message;
        if (Array.isArray(serverMessage)) {
          serverMessage.forEach((msg: string) => toast.error(msg));
        } else if (typeof serverMessage === "string") {
          toast.error(serverMessage);
        } else {
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
      const response = await resetMemberPassword({
        memberId: cleanedMemberId,
        otp: otp.trim(),
        newPassword,
      });

      if (response?.status !== true) {
        toast.error(response?.message || "Password reset failed");
        return;
      }

      toast.success(response?.message || "Password reset successfully");
      setOtpStep(false);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <ShieldQuestion className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Member Password Reset</CardTitle>
          <CardDescription>
            Provide your Member ID to request a reset OTP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memberId">Member ID</Label>
              <Input
                id="memberId"
                placeholder="HM0000001"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value.toUpperCase())}
                required
                disabled={otpStep}
              />
            </div>

            {otpStep && (
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  maxLength={6}
                  required
                />
              </div>
            )}

            {otpStep && (
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {otpStep && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
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
            Back to login?{" "}
            <Link href="/member-login" className="text-primary font-semibold">
              Member Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
