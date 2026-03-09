"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { CircleDollarSign, Save, X } from "lucide-react";

export default function CoinSettingPage() {
    const [formData, setFormData] = useState({
        name: "HIKE MOVE",
        symbol: "HIKE MOVE",
        currentPrice: "95",
        quantity: "10000000",
        lastUpdated: "11/26/2025 1:12:23 AM",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Coin settings updated successfully");
        } catch (error) {
            toast.error("Failed to update coin settings");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Coin Setting"
                breadcrumbs={[
                    { title: "Configuration", href: "#" },
                    { title: "Coin Setting" },
                ]}
            />

            <div className="flex-1 min-w-0 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <Card className="w-full max-w-[980px] min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                                <CircleDollarSign className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                                <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                    Coin Setting
                                </CardTitle>
                                <p className="mt-0.5 text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                    Manage coin details and current values.
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-3 sm:p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="rounded-md border border-[#dce8d3] bg-[#fafcf8] p-3">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="name"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter Coin Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] font-medium shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="symbol"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Symbol
                                        </Label>
                                        <Input
                                            id="symbol"
                                            placeholder="Enter Coin Symbol"
                                            value={formData.symbol}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] font-medium shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="currentPrice"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Current Price
                                        </Label>
                                        <Input
                                            id="currentPrice"
                                            placeholder="Enter Current Price"
                                            value={formData.currentPrice}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] font-mono font-medium shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="quantity"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Quantity
                                        </Label>
                                        <Input
                                            id="quantity"
                                            placeholder="Enter Quantity"
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] font-mono font-medium shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5 md:col-span-2 xl:col-span-2">
                                        <Label
                                            htmlFor="lastUpdated"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Last Updated
                                        </Label>
                                        <div className="flex h-8 w-full min-w-0 items-center rounded-md border border-[#dce8d3] bg-[#f3f7ef] px-3 text-[13px] font-mono text-[#6f7664] shadow-sm">
                                            <span className="truncate">{formData.lastUpdated}</span>
                                        </div>
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
                                            name: "HIKE MOVE",
                                            symbol: "HIKE MOVE",
                                            currentPrice: "95",
                                            quantity: "10000000",
                                            lastUpdated: "11/26/2025 1:12:23 AM",
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
                                    {isLoading ? "Saving..." : "Submit"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}