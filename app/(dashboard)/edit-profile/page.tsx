"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Fingerprint,
  ShieldCheck,
  Wallet,
  Globe,
  Copy,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { api } from "@/lib/axios";
import { getMemberStatus } from "@/lib/utils/member-status";
import { getMyMemberTopupsAPI } from "@/lib/api/member-topup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UserProfile {
  fullName: string;
  role: string;
  country: string;
  memberId: string;
  package?: string;
  packages?: Array<{ amount: number; endDate?: string; status: string }>;
  sponsorId: {
    _id: string;
    fullName: string;
    memberId: string;
  } | string;
  sponsorName: string;
  joiningDate: string;
  activationDate: string;
  phone: string;
  email: string;
  walletAddress: string;
  avatar: string;
  level: number;
  gender: string;
  status: string;
  expirationDate?: string | null;
  createdAt?: string;
}

const maleAvatar = "/avatars/male_avatar.png";
const femaleAvatar = "/avatars/female_avatar.png";

const avatars = [
  { id: "male", url: maleAvatar },
  { id: "female", url: femaleAvatar },
];

export default function EditProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [meRes, topupRes] = await Promise.all([
          api.get("/member/me"),
          getMyMemberTopupsAPI().catch(() => null)
        ]);

        if (meRes.data?.status && meRes.data.data) {
          const rawData = meRes.data.data;
          
          let packageAmount = rawData.package || rawData.packageName || rawData.packageAmount || "";
          let userPackages: Array<{ amount: number; endDate?: string; status: string }> = [];
          
          if (topupRes?.data?.status && Array.isArray(topupRes.data.data) && topupRes.data.data.length > 0) {
            userPackages = topupRes.data.data.map((topup: any) => ({
              amount: topup.amount,
              endDate: topup.endDate,
              status: topup.status
            }));
            
            // Still set primary package for backward compatibility/other UI parts
            const activeTopup = topupRes.data.data.find((t: any) => t.status === "active") || topupRes.data.data[0];
            if (activeTopup && activeTopup.amount) {
              packageAmount = activeTopup.amount.toString();
            }
          }

          const userData: UserProfile = {
            ...rawData,
            avatar: rawData.avatar || (rawData.gender === "female" ? femaleAvatar : maleAvatar),
            sponsorName: rawData.sponsorId?.fullName || "N/A",
            sponsorId: typeof rawData.sponsorId === 'object' ? rawData.sponsorId?.memberId : rawData.sponsorId,
            package: packageAmount,
            packages: userPackages,
            joiningDate: rawData.createdAt ? new Date(rawData.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : "N/A",
            activationDate: rawData.activationDate ? new Date(rawData.activationDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : "No Active",
            status: getMemberStatus(rawData),
          };
          setProfile(userData);
          setFormData(userData);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSaveProfile = async () => {
    if (!formData) return;
    try {
      const res = await api.patch("/member/me", formData);
      if (res.data?.status) {
        setProfile(formData);
        setIsProfileDialogOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openUpdateDialog = () => {
    if (profile) {
      setFormData(profile);
      setIsProfileDialogOpen(true);
    }
  };

  if (loading || !profile || !formData) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="View Profile"
        breadcrumbs={[{ title: "App", href: "#" }, { title: "Profile" }]}
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="bg-muted/30 border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-background shadow-xl overflow-hidden bg-white">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-background shadow-lg">
              <div className={`h-2 w-2 rounded-full ${profile.status === "active" ? "bg-emerald-500" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"}`}></div>
            </div>
          </div>

          <div className="text-center md:text-left space-y-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">
                {profile.fullName}
              </h2>
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
                  Level {profile.level}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${profile.status === "active" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>
                  {profile.status}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              <span className="text-sm font-bold uppercase tracking-widest">
                {profile.country}
              </span>
            </div>
          </div>

          <div className="md:ml-auto flex gap-2">
            {/* <Button
              size="sm"
              variant="outline"
              className="font-bold text-xs h-9"
              onClick={openUpdateDialog}
            >
              CHANGE AVATAR
            </Button>
            <Button
              size="sm"
              className="font-bold text-xs h-9"
              onClick={openUpdateDialog}
            >
              UPDATE PROFILE
            </Button> */}
          </div>
        </div>

        <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
          <SectionHeading title="Account Details" isFirst />
          <InfoRow
            label="Member ID"
            value={profile.memberId}
            icon={<Fingerprint className="h-3.5 w-3.5" />}
            onCopy
          />
          {/*
          <InfoRow
            label="Sponsor ID"
            value={typeof profile.sponsorId === 'object' ? (profile.sponsorId as any).memberId : profile.sponsorId}
            icon={<ShieldCheck className="h-3.5 w-3.5" />}
            onCopy
          />
          <InfoRow
            label="Sponsor Name"
            value={profile.sponsorName}
            icon={<User className="h-3.5 w-3.5" />}
          />
          */}

          <SectionHeading title="Activity Status" />
          <InfoRow
            label="Joining Date"
            value={profile.joiningDate}
            icon={<Calendar className="h-3.5 w-3.5" />}
          />
          <InfoRow
            label="Activation Date"
            value={profile.activationDate}
            icon={<CheckCircle2 className="h-3.5 w-3.5" />}
          />
          {profile.packages && profile.packages.length > 0 ? (
            <>
              <InfoRow
                label="Expiration Date"
                value={profile.packages.map(pkg => pkg.endDate ? new Date(pkg.endDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }) : "N/A").join(", ")}
                icon={<Calendar className="h-3.5 w-3.5" />}
              />
              <InfoRow
                label="Package"
                value={profile.packages.map(pkg => `$${pkg.amount}`).join(", ")}
                icon={<Wallet className="h-3.5 w-3.5" />}
              />
            </>
          ) : (
            <>
              <InfoRow
                label="Expiration Date"
                value="N/A"
                icon={<Calendar className="h-3.5 w-3.5" />}
              />
              <InfoRow
                label="Package"
                value={profile.package ? `$${profile.package}` : "0"}
                icon={<Wallet className="h-3.5 w-3.5" />}
              />
            </>
          )}

          <SectionHeading title="Contact Information" />
          <InfoRow
            label="Phone"
            value={profile.phone}
            icon={<Phone className="h-3.5 w-3.5" />}
          />
          <InfoRow
            label="Email Id"
            value={profile.email}
            icon={<Mail className="h-3.5 w-3.5" />}
          />
          <InfoRow
            label="Gender"
            value={profile.gender}
            icon={<User className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-7xl rounded-xl sm:rounded-xl">
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Edit your profile details and choose an avatar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            <div className="flex flex-col md:flex-row items-center gap-5 border border-border bg-muted/20 p-5">
              <div className="relative">
                <div className="w-24 h-24 overflow-hidden border-4 border-background shadow-lg bg-white">
                  <img
                    src={formData.avatar}
                    alt={formData.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 border-2 border-background">
                  <Camera className="h-4 w-4" />
                </div>
              </div>

              <div className="text-center md:text-left">
                <h3 className="text-xl font-black uppercase text-foreground">
                  {formData.fullName || "Profile Preview"}
                </h3>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                  Level {formData.level} • {formData.country} • {formData.gender}
                </p>
              </div>

              <div className="md:ml-auto space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Select Avatar
                </h4>
                <div className="flex gap-3">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => handleInputChange("avatar", avatar.url)}
                      className={`w-12 h-12 border-2 transition-all bg-background overflow-hidden ${formData.avatar === avatar.url
                        ? "border-primary shadow-md scale-110"
                        : "border-border hover:border-primary/40"
                        }`}
                    >
                      <img
                        src={avatar.url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input
                  className="h-9 rounded-none"
                  value={formData.fullName || ""}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Level</Label>
                <Input
                  className="h-9 rounded-none"
                  type="number"
                  value={formData.level || 0}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Country</Label>
                <Input
                  className="h-9 rounded-none"
                  value={formData.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</Label>
                <Input
                  className="h-9 rounded-none"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</Label>
                <Input
                  className="h-9 rounded-none"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gender</Label>
                <Input
                  className="h-9 rounded-none"
                  value={formData.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Member ID</Label>
                <Input
                  className="h-9 rounded-none"
                  value={formData.memberId || ""}
                  onChange={(e) => handleInputChange("memberId", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sponsor ID</Label>
                <Input
                  className="h-9 rounded-none"
                  value={(typeof formData.sponsorId === 'object' ? (formData.sponsorId as any).memberId : formData.sponsorId) || ""}
                  disabled
                  onChange={(e) =>
                    handleInputChange("sponsorId", e.target.value)
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</Label>
                <Input
                  className="h-9 rounded-none"
                  value={formData.status || ""}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                className="rounded-none font-bold text-xs h-9 px-6"
                onClick={() => setIsProfileDialogOpen(false)}
              >
                CANCEL
              </Button>
              <Button
                type="button"
                className="rounded-none font-bold text-xs h-9 px-6"
                onClick={handleSaveProfile}
              >
                SAVE CHANGES
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}

function InfoRow({
  label,
  value,
  icon,
  onCopy,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  onCopy?: boolean;
}) {
  return (
    <div className="grid grid-cols-[150px_minmax(0,1fr)] border-b border-border/70 last:border-b-0">
      <div className="flex items-center gap-2 bg-muted/40 px-3 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
        <span className="text-muted-foreground/80">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <p className="text-sm font-semibold text-foreground truncate">
          {value || "N/A"}
        </p>
        {onCopy && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 text-muted-foreground"
            onClick={() => {
              navigator.clipboard.writeText(value);
              toast.success(`${label} copied!`);
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function SectionHeading({
  title,
  isFirst = false,
}: {
  title: string;
  isFirst?: boolean;
}) {
  return (
    <div
      className={`bg-muted/40 px-6 py-3 text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground border-y border-border/70 ${
        isFirst ? "border-t-0" : ""
      }`}
    >
      {title}
    </div>
  );
}