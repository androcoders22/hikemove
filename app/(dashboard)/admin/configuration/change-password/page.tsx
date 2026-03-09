"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { KeyRound, Lock, ShieldCheck, Save, X } from "lucide-react";

export default function ChangePasswordPage() {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }

        setIsLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success("Password changed successfully");

            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            toast.error("Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Change Password"
                breadcrumbs={[
                    { title: "Configuration", href: "#" },
                    { title: "Change Password" },
                ]}
            />

            <div className="flex-1 min-w-0 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <Card className="w-full max-w-[980px] min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                                <KeyRound className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                                <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                    Change Password
                                </CardTitle>
                                <p className="mt-0.5 text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                    Update your account password securely.
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-3 sm:p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="rounded-md border border-[#dce8d3] bg-[#fafcf8] p-3">
                                <div className="grid grid-cols-1 gap-3 xl:grid-cols-[180px_minmax(0,1fr)] xl:items-center xl:gap-x-6">
                                    <Label
                                        htmlFor="oldPassword"
                                        className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                    >
                                        Old Password
                                        <span className="ml-1 text-destructive">*</span>
                                    </Label>

                                    <div className="relative group min-w-0">
                                        <Input
                                            id="oldPassword"
                                            type="password"
                                            placeholder="Enter Current Password"
                                            value={formData.oldPassword}
                                            onChange={handleInputChange}
                                            required
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-9 pr-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                        <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e] transition-colors group-focus-within:text-primary" />
                                    </div>

                                    <Label
                                        htmlFor="newPassword"
                                        className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                    >
                                        New Password
                                        <span className="ml-1 text-destructive">*</span>
                                    </Label>

                                    <div className="relative group min-w-0">
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Enter New Password"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            required
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-9 pr-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                        <ShieldCheck className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e] transition-colors group-focus-within:text-primary" />
                                    </div>

                                    <Label
                                        htmlFor="confirmPassword"
                                        className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                    >
                                        Confirm Password
                                        <span className="ml-1 text-destructive">*</span>
                                    </Label>

                                    <div className="relative group min-w-0">
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm New Password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            required
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-9 pr-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                        <ShieldCheck className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e] transition-colors group-focus-within:text-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-2 border-t border-[#edf3e7] pt-3 sm:flex-row sm:items-center sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-8 w-full rounded-md border-[#dce8d3] bg-white px-3 text-[10px] font-bold uppercase tracking-[0.04em] text-[#5b624f] shadow-sm hover:bg-[#f1f7eb] sm:w-auto"
                                    onClick={() =>
                                        setFormData({
                                            oldPassword: "",
                                            newPassword: "",
                                            confirmPassword: "",
                                        })
                                    }
                                >
                                    <X className="mr-1.5 h-3.5 w-3.5" />
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-8 w-full rounded-md bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.04em] text-white shadow-sm hover:bg-primary/90 sm:w-auto"
                                >
                                    <Save className="mr-1.5 h-3.5 w-3.5" />
                                    {isLoading ? "Updating..." : "Submit"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}