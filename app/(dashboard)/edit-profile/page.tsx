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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UserProfile {
  name: string;
  role: string;
  country: string;
  memberId: string;
  sponsorId: string;
  sponsorName: string;
  joiningDate: string;
  activationDate: string;
  mobile: string;
  email: string;
  walletAddress: string;
  avatar: string;
}

const maleAvatar = `data:image/svg+xml;utf8,
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
  <rect width='200' height='200' rx='0' fill='%23f4f4f5'/>
  <circle cx='100' cy='100' r='92' fill='none' stroke='%23d4d4d8' stroke-width='8'/>
  <circle cx='100' cy='72' r='28' fill='%239ca3af'/>
  <path d='M58 56c6-18 24-30 42-30 18 0 36 12 42 30v10H58V56z' fill='%238b949e'/>
  <path d='M46 164c8-30 30-48 54-48s46 18 54 48' fill='%239ca3af'/>
</svg>`;

const femaleAvatar = `data:image/svg+xml;utf8,
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
  <rect width='200' height='200' rx='0' fill='%23f5f5f5'/>
  <circle cx='100' cy='100' r='92' fill='none' stroke='%23d4d4d8' stroke-width='8'/>
  <path d='M60 78c0-26 18-46 40-46s40 20 40 46c0 15-6 26-16 34H76C66 104 60 93 60 78z' fill='%238b949e'/>
  <circle cx='100' cy='78' r='24' fill='%239ca3af'/>
  <path d='M48 166c10-28 30-44 52-44s42 16 52 44' fill='%239ca3af'/>
</svg>`;

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
    fetch("/data/profile.json")
      .then((res) => res.json())
      .then((data) => {
        const userData = {
          ...data.user,
          avatar: data.user.avatar || maleAvatar,
        };
        setProfile(userData);
        setFormData(userData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  const copyToClipboard = (text: string, label: string) => {
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

  const handleSaveProfile = () => {
    if (!formData) return;
    setProfile(formData);
    setIsProfileDialogOpen(false);
    toast.success("Profile updated successfully!");
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
        title="Edit Profile"
        breadcrumbs={[{ title: "App", href: "#" }, { title: "Profile" }]}
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="bg-muted/30 border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-background shadow-xl overflow-hidden bg-white">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-background shadow-lg">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">
                {profile.name}
              </h2>
              <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest self-center md:self-auto">
                {profile.role}
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              <span className="text-sm font-bold uppercase tracking-widest">
                {profile.country}
              </span>
            </div>
          </div>

          <div className="md:ml-auto flex gap-2">
            <Button
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
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              Account & Sponsorship
            </h3>
            <div className="bg-background border border-border rounded-xl divide-y divide-border">
              <InfoRow
                label="Member ID"
                value={profile.memberId}
                icon={<Fingerprint className="h-3.5 w-3.5" />}
                onCopy
              />
              <InfoRow
                label="Sponsor ID"
                value={profile.sponsorId}
                icon={<ShieldCheck className="h-3.5 w-3.5" />}
                onCopy
              />
              <InfoRow
                label="Sponsor Name"
                value={profile.sponsorName}
                icon={<User className="h-3.5 w-3.5" />}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              Activity Status
            </h3>
            <div className="bg-background border border-border rounded-xl divide-y divide-border">
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
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              Contact Information
            </h3>
            <div className="bg-background border border-border rounded-xl divide-y divide-border">
              <InfoRow
                label="Mobile"
                value={profile.mobile}
                icon={<Phone className="h-3.5 w-3.5" />}
              />
              <InfoRow
                label="Email Id"
                value={profile.email}
                icon={<Mail className="h-3.5 w-3.5" />}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
            Financial Assets
          </h3>
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center text-primary border border-border">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Wallet Address USDT (BEP 20)
                  </p>
                  <p className="text-sm font-mono font-bold text-foreground break-all">
                    {profile.walletAddress}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="font-bold text-[10px] h-8 shrink-0 border-border"
                onClick={() =>
                  copyToClipboard(profile.walletAddress, "Wallet Address")
                }
              >
                <Copy className="h-3 w-3 mr-1.5" />
                COPY ADDRESS
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Edit your profile details and choose an avatar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            <div className="flex flex-col md:flex-row items-center gap-5 rounded-xl border border-border bg-muted/20 p-5">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg bg-white">
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-2 border-2 border-background">
                  <Camera className="h-4 w-4" />
                </div>
              </div>

              <div className="text-center md:text-left">
                <h3 className="text-xl font-black uppercase text-foreground">
                  {formData.name || "Profile Preview"}
                </h3>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                  {formData.role} • {formData.country}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Mobile</Label>
                <Input
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Wallet Address</Label>
                <Input
                  value={formData.walletAddress}
                  onChange={(e) =>
                    handleInputChange("walletAddress", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Member ID</Label>
                <Input
                  value={formData.memberId}
                  onChange={(e) => handleInputChange("memberId", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Sponsor ID</Label>
                <Input
                  value={formData.sponsorId}
                  onChange={(e) =>
                    handleInputChange("sponsorId", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Sponsor Name</Label>
                <Input
                  value={formData.sponsorName}
                  onChange={(e) =>
                    handleInputChange("sponsorName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Joining Date</Label>
                <Input
                  value={formData.joiningDate}
                  onChange={(e) =>
                    handleInputChange("joiningDate", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Activation Date</Label>
                <Input
                  value={formData.activationDate}
                  onChange={(e) =>
                    handleInputChange("activationDate", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-foreground">
                Choose Avatar
              </h4>

              <div className="grid grid-cols-2 gap-4 sm:max-w-md">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => handleInputChange("avatar", avatar.url)}
                    className={`rounded-2xl border-2 p-3 transition-all bg-background ${
                      formData.avatar === avatar.url
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted">
                      <img
                        src={avatar.url}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProfileDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
    <div className="p-3 flex items-center justify-between group hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-muted-foreground shrink-0">{icon}</div>
        <div className="min-w-0">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-tight">
            {label}
          </p>
          <p className="text-sm font-bold text-foreground truncate">{value}</p>
        </div>
      </div>

      {onCopy && (
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => {
            navigator.clipboard.writeText(value);
            toast.success(`${label} copied!`);
          }}
        >
          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}