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
import { checkMemberIdAPI, memberSignup } from "@/lib/api/member";

// List of countries
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Côte d'Ivoire", "Croatia",
  "Cuba", "Cyprus", "Czech Republic", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
  "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece",
  "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco",
  "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
  "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function MemberSignupPage() {
  const params = useParams();
  const router = useRouter();
  const paramMemberId = (params?.memberId as string) || "";
  const isReferralSignup = Boolean(paramMemberId && paramMemberId !== "default");

  const [loading, setLoading] = useState(false);
  const [sponsorLoading, setSponsorLoading] = useState(false);
  const [sponsor, setSponsor] = useState<any>(null);
  const [sponsorMemberId, setSponsorMemberId] = useState(
    paramMemberId !== "default" ? paramMemberId : "",
  );
  const [sponsorStatus, setSponsorStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    country: "",
    password: "",
    transactionPassword: "",
  });

  useEffect(() => {
    const incomingReferral = (params?.memberId as string) || "";
    if (
      incomingReferral &&
      incomingReferral !== "default" &&
      incomingReferral !== sponsorMemberId
    ) {
      setSponsorMemberId(incomingReferral);
    }
  }, [params?.memberId]);

  useEffect(() => {
    if (sponsorMemberId) {
      const timeoutId = setTimeout(() => {
        checkSponsor(sponsorMemberId);
      }, 500); // 500ms debounce
      return () => clearTimeout(timeoutId);
    } else {
      setSponsor(null);
      setSponsorStatus("idle");
    }
  }, [sponsorMemberId]);

  const checkSponsor = async (value: string) => {
    const memberId = value.trim();

    if (!memberId || memberId === "default") {
      setSponsor(null);
      setSponsorStatus("idle");
      setSponsorLoading(false);
      return;
    }

    try {
      setSponsorLoading(true);
      setSponsorStatus("checking");

      const res = await checkMemberIdAPI(memberId);
      if (res.data?.status && res.data?.data) {
        setSponsor(res.data.data);
        setSponsorStatus("valid");
      } else {
        setSponsor(null);
        setSponsorStatus("invalid");
      }
    } catch (err) {
      setSponsor(null);
      setSponsorStatus("invalid");
    } finally {
      setSponsorLoading(false);
    }
  };

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
    } catch { }

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

  if (loading) {
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
          <div className="mx-auto flex h-20 w-auto items-center justify-center">
            <img src="/hikemovelogo.png" alt="HikeMove Logo" className="h-26 w-auto object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold">Member Sign Up</CardTitle>
          {!isReferralSignup && (
            <CardDescription>
              {sponsor ? (
                <span>
                  Your sponsor is <strong>{sponsor.fullName}</strong> (
                  {sponsor.memberId})
                </span>
              ) : (
                <span>Please enter a valid sponsor member ID to sign up.</span>
              )}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="sponsorMemberId">Member Id</Label>
                <Input
                  id="sponsorMemberId"
                  name="sponsorMemberId"
                  value={sponsorMemberId}
                  onChange={(e) => setSponsorMemberId(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter sponsor member ID"
                  required
                />
                {sponsorLoading && (
                  <p className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Checking...
                  </p>
                )}
                {sponsorStatus === "valid" && !sponsorLoading && (
                  <p className="text-xs font-semibold text-emerald-600">
                    ID is available
                  </p>
                )}
                {sponsorStatus === "invalid" && !sponsorLoading && (
                  <p className="text-xs font-semibold text-red-500">
                    ID does not exist
                  </p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
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
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(val) => handleSelectChange("country", val)}
                  required
                >
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
