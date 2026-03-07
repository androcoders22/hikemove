"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserCog, Search, Save } from "lucide-react";

export default function ChangeProfilePage() {
    const [memberId, setMemberId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memberId) {
            toast.error("Please enter a Member ID");
            return;
        }
        setIsLoading(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 800));
            toast.success("Profile data loaded successfully");
        } catch (error) {
            toast.error("Failed to fetch profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 w-full bg-background/30">
            <PageHeader
                title="Member Change Profile"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "Change Profile" },
                ]}
            />

            <div className="flex px-6 py-4 md:p-8 mt-1 pt-0">
                <Card className="w-full border-none shadow-sm rounded-xl overflow-hidden   bg-white dark:bg-card pt-0">
                    <CardHeader className="border-b bg-muted/20 px-8 py-6 ">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 rounded-lg text-primary">
                                <UserCog className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight ">
                                Member Change Profile
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
                            {/* First Row: Label and Input */}
                            <div className="flex flex-col md:flex-row items-center gap-12">
                                <Label
                                    htmlFor="memberId"
                                    className="text-sm font-bold text-foreground/70 uppercase tracking-widest whitespace-nowrap"
                                >
                                    Your Member Id
                                </Label>
                                <div className="relative group flex-1">
                                    <Input
                                        id="memberId"
                                        placeholder="Enter Member ID"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        className="h-12 pl-12 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg font-medium w-full"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                </div>
                            </div>

                            {/* Second Row: Submit Button on Left */}
                            <div className="flex justify-start">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-11 px-10 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] rounded-lg shadow-sm transition-all flex items-center gap-2 group"
                                >
                                    <Save className="h-4 w-4" />
                                    {isLoading ? "Wait..." : "Submit"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
