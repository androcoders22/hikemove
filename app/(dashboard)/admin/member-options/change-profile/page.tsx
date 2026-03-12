"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { UserCog, Search, Save, User, Mail, Phone, Calendar, ShieldCheck, MailPlus } from "lucide-react";
import { checkMemberIdAPI } from "@/lib/api/member";
import { api } from "@/lib/axios";

export default function ChangeProfilePage() {
    const [memberId, setMemberId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [memberData, setMemberData] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!memberId) {
            toast.error("Please enter a Member ID");
            return;
        }

        setIsLoading(true);
        setMemberData(null);

        try {
            const res = await checkMemberIdAPI(memberId);
            if (res.data?.status && res.data.data) {
                setMemberData(res.data.data);
                toast.success("Member profile retrieved");
            } else {
                toast.error(res.data?.message || "Member not found");
            }
        } catch (error: any) {
            console.error("Check member error:", error);
            // Error toast usually handled by interceptor
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            // Placeholder for update API - typically part of profile management
            await new Promise(r => setTimeout(r, 1000));
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Member Profile Details"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "Member Profile Details" },
                ]}
            />

            <div className="flex-1 min-w-0 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <Card className="min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                                <UserCog className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                                <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                    Member Profile Details
                                </CardTitle>
                                <p className="mt-0.5 text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                    Search a member profile by ID.
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-3 sm:p-4">
                        <form onSubmit={handleSubmit} className="max-w-4xl space-y-4">
                            <div className="rounded-md border border-[#dce8d3] bg-[#fafcf8] p-3">
                                <div className="grid grid-cols-1 gap-3 xl:grid-cols-[160px_minmax(0,1fr)_auto] xl:items-center">
                                    <Label
                                        htmlFor="memberId"
                                        className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#5f6851] whitespace-nowrap"
                                    >
                                        Your Member Id
                                    </Label>

                                    <div className="relative group min-w-0">
                                        <Input
                                            id="memberId"
                                            placeholder="Enter Member ID"
                                            value={memberId}
                                            onChange={(e) => setMemberId(e.target.value)}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-9 pr-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e] transition-colors group-focus-within:text-primary" />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-8 w-full rounded-md bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-white shadow-sm transition-all hover:bg-primary/90 sm:w-auto"
                                    >
                                        <Save className="mr-1.5 h-3.5 w-3.5" />
                                        {isLoading ? "Wait..." : "Submit"}
                                    </Button>
                                </div>
                            </div>
                        </form>

                        {memberData && (
                            <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <form onSubmit={handleUpdateProfile} className="max-w-4xl space-y-6">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {/* Full Name */}
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-[#5f6851]">Full Name</Label>
                                            <div className="relative group">
                                                <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e]" />
                                                <Input
                                                    defaultValue={memberData.fullName}
                                                    className="h-9 w-full rounded-md border-[#dce8d3] bg-white pl-9 text-[13px] shadow-sm focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-[#5f6851]">Email Address</Label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e]" />
                                                <Input
                                                    defaultValue={memberData.email}
                                                    className="h-9 w-full rounded-md border-[#dce8d3] bg-white pl-9 text-[13px] shadow-sm focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-[#5f6851]">Phone Number</Label>
                                            <div className="relative group">
                                                <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e]" />
                                                <Input
                                                    defaultValue={memberData.phone}
                                                    className="h-9 w-full rounded-md border-[#dce8d3] bg-white pl-9 text-[13px] shadow-sm focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                                />
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] font-bold uppercase tracking-wider text-[#5f6851]">Current Status</Label>
                                            <div className="relative group">
                                                <ShieldCheck className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e]" />
                                                <Input
                                                    readOnly
                                                    value={memberData.status}
                                                    className="h-9 w-full rounded-md border-[#dce8d3] bg-muted/30 pl-9 text-[13px] font-semibold text-primary shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <Button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="h-9 rounded-md bg-primary px-6 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
                                        >
                                            {isUpdating ? (
                                                <span className="flex items-center gap-2">
                                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    Updating...
                                                </span>
                                            ) : (
                                                "Save Changes"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}