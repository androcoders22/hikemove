"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, UserPlus } from "lucide-react";
import { getMember, memberSignup } from "@/lib/api/member";

export default function MemberSignupPage() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [sponsorLoading, setSponsorLoading] = useState(true);
  const [sponsor, setSponsor] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    country: "",
    package: "",
    password: "",
    transactionPassword: "",
  });

  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        setSponsorLoading(true);
        // Fallback to "anything" if params.memberId is missing somehow
        const memberIdToFetch = (params.memberId as string) || "anything";
        const res = await getMember(memberIdToFetch);
        if (res.status === true && res.data) {
          setSponsor(res.data);
        } else {
          // Attempt default on failure
          const fallbackRes = await getMember("anything");
          if (fallbackRes.status === true && fallbackRes.data) {
            setSponsor(fallbackRes.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch sponsor", err);
        // Make another attempt with a fallback string if it fails
        try {
          const fallbackRes = await getMember("anything");
          if (fallbackRes.status === true && fallbackRes.data) {
            setSponsor(fallbackRes.data);
          }
        } catch (e) {}
      } finally {
        setSponsorLoading(false);
      }
    };

    fetchSponsor();
  }, [params.memberId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    let toastMod: any;
    try {
      toastMod = await import("react-hot-toast");
    } catch {}

    const toast = toastMod?.default;

    if (!sponsor?._id) {
      toast?.error?.("Invalid Sponsor. Cannot sign up.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        sponsorId: sponsor._id,
        status: "active",
      };

      const res = await memberSignup(payload);

      if (res.status === true) {
        toast?.success?.("Member created successfully");
        router.push("/member-login");
      } else {
        toast?.error?.(res.message || "Failed to sign up");
      }
    } catch (err: any) {
      console.error(err);
      toast?.error?.(
        err?.response?.data?.message || "Something went wrong during sign up.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (sponsorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <UserPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Member Sign Up</CardTitle>
          <CardDescription>
            {sponsor ? (
              <span>
                Your sponsor is <strong>{sponsor.fullName}</strong> (
                {sponsor.memberId})
              </span>
            ) : (
              <span className="text-red-500">Could not identify sponsor</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Test User"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. test@user.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +1234567890"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) => handleSelectChange("gender", val)}
                  required
                >
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g. INDIA"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="package">Package</Label>
                <Input
                  id="package"
                  name="package"
                  value={formData.package}
                  onChange={handleInputChange}
                  placeholder="e.g. Basic"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionPassword">
                  Transaction Password
                </Label>
                <Input
                  id="transactionPassword"
                  name="transactionPassword"
                  type="password"
                  value={formData.transactionPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-3"
              disabled={loading || !sponsor}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Registering..." : "Sign Up"}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => router.push("/member-login")}
              >
                Already have an account? Login In
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
