"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Fingerprint,
  ShieldCheck,
  Wallet,
  Globe,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

export default function EditProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/profile.json")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.user);
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

  if (loading || !profile) return null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Edit Profile"
        breadcrumbs={[{ title: "App", href: "#" }, { title: "Profile" }]}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Profile Card Header */}
        <div className="bg-muted/30 border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-background shadow-xl overflow-hidden">
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
            >
              CHANGE AVATAR
            </Button>
            <Button size="sm" className="font-bold text-xs h-9">
              UPDATE PROFILE
            </Button>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* IDs & Sponsorship */}
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

          {/* Activity Dates */}
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

          {/* Contact Details */}
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

        {/* Financial Details */}
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
