"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyRound, Lock, ShieldCheck, Save, X } from "lucide-react";

export default function ChangePasswordPage() {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Password changed successfully");
            setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error("Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 w-full bg-background/30">
            <PageHeader
                title="Change Password"
                breadcrumbs={[
                    { title: "Configuration", href: "#" },
                    { title: "Change Password" },
                ]}
            />

            <div className="flex p-6 md:p-10 ">
                <Card className="max-w-5xl w-full border-none shadow-sm rounded-xl overflow-hidden bg-white dark:bg-card pt-0 ">
                    <CardHeader className="border-b bg-muted/20 px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <KeyRound className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight">
                                Change Password
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                {/* Old Password */}
                                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] items-center gap-x-12 gap-y-2">
                                    <Label htmlFor="oldPassword" id="oldPasswordLabel" className="text-sm font-bold text-foreground/70 uppercase tracking-widest">
                                        Old Password<span className="text-destructive ml-1">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <Input
                                            id="oldPassword"
                                            type="password"
                                            placeholder="Enter Current Password"
                                            value={formData.oldPassword}
                                            onChange={handleInputChange}
                                            required
                                            className="h-12 pl-10 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg"
                                        />
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] items-center gap-x-12 gap-y-2">
                                    <Label htmlFor="newPassword" id="newPasswordLabel" className="text-sm font-bold text-foreground/70 uppercase tracking-widest">
                                        New Password<span className="text-destructive ml-1">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Enter New Password"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            required
                                            className="h-12 pl-10 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg"
                                        />
                                        <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] items-center gap-x-12 gap-y-2">
                                    <Label htmlFor="confirmPassword" id="confirmPasswordLabel" className="text-sm font-bold text-foreground/70 uppercase tracking-widest">
                                        Confirm Password<span className="text-destructive ml-1">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm New Password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            required
                                            className="h-12 pl-10 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg"
                                        />
                                        <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-4 pt-8 border-t border-border">
                                <Button
                                    type="submit"
                                    id="submitPassword"
                                    disabled={isLoading}
                                    className="h-11 px-8 bg-primary hover:bg-primary/80 text-white font-black uppercase tracking-widest text-[11px] rounded-lg shadow-sm transition-all flex items-center gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {isLoading ? "Updating..." : "Submit"}
                                </Button>
                                <Button
                                    type="button"
                                    id="cancelPassword"
                                    variant="outline"
                                    className="h-11 px-8 border-border hover:bg-muted font-black uppercase tracking-widest text-[11px] rounded-lg transition-all flex items-center gap-2"
                                    onClick={() => setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" })}
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
