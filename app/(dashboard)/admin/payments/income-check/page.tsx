"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search, Calendar as CalendarIcon, WalletCards, ArrowRight } from "lucide-react";

export default function IncomeCheckPage() {
    const [memberId, setMemberId] = useState("");
    const [date, setDate] = useState("");
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
            toast.success("Income data retrieved successfully");
        } catch (error) {
            toast.error("Failed to fetch income data");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 w-full bg-background/30">
            <PageHeader
                title="Income Check"
                breadcrumbs={[
                    { title: "Payments", href: "#" },
                    { title: "Income Check" },
                ]}
            />

            <div className="flex p-6 md:p-8 pt-0">
                <Card className="w-full border-none shadow-sm rounded-xl overflow-hidden bg-white dark:bg-card pt-0">
                    <CardHeader className="border-b bg-muted/20 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <WalletCards className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight">
                                Income Check
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center justify-between gap-6 bg-muted/10 p-6 rounded-xl border border-border/50">
                            <div className="flex flex-col md:flex-row items-center gap-6 flex-1 justify-center">
                                {/* Member ID Title */}
                                <div className="md:absolute md:left-8 lg:left-20 text-[11px] font-black uppercase tracking-widest text-foreground whitespace-nowrap mb-2 md:mb-0">
                                    Your Member Id
                                </div>

                                {/* Member ID Input */}
                                <div className="relative group w-full max-w-sm">
                                    <Input
                                        id="memberId"
                                        placeholder="Enter Member ID"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        className="h-11 pl-10 bg-white dark:bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg font-medium"
                                    />
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                </div>

                                {/* Date Field */}
                                <div className="relative group w-full max-w-[200px]">
                                    <Input
                                        id="date"
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="h-11 pl-10 bg-white dark:bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg font-medium cursor-pointer"
                                    />
                                    <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                </div>
                            </div>

                            {/* Submit Button on Right */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-11 px-8 bg-primary hover:bg-primary/80 text-white font-black uppercase tracking-widest text-[10px] rounded-lg shadow-sm transition-all flex items-center gap-2 group shrink-0"
                            >
                                {isLoading ? "Checking..." : (
                                    <>
                                        Submit
                                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
