"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CircleDollarSign, Save, X } from "lucide-react";

export default function CoinSettingPage() {
    const [formData, setFormData] = useState({
        name: "HIKE MOVE",
        symbol: "HIKE MOVE",
        currentPrice: "95",
        quantity: "10000000",
        lastUpdated: "11/26/2025 1:12:23 AM"
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Coin settings updated successfully");
        } catch (error) {
            toast.error("Failed to update coin settings");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-3 w-full bg-background/30">
            <PageHeader
                title="Coin Setting"
                breadcrumbs={[
                    { title: "Configuration", href: "#" },
                    { title: "Coin Setting" },
                ]}
            />

            <div className="flex p-6 md:p-10">
                <Card className="w-full border-none shadow-sm rounded-xl overflow-hidden bg-white dark:bg-card">
                    <CardHeader className="border-b bg-muted/20 px-6 py-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <CircleDollarSign className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-xl font-black text-foreground uppercase tracking-tight">
                                Coin Setting
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                {/* Name */}
                                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] items-center gap-x-12 gap-y-2">
                                    <Label htmlFor="name" className="text-sm font-bold text-foreground/70 uppercase tracking-widest">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter Coin Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="h-12 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg font-medium"
                                    />
                                </div>

                                {/* Symbol */}
                                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] items-center gap-x-12 gap-y-2">
                                    <Label htmlFor="symbol" className="text-sm font-bold text-foreground/70 uppercase tracking-widest">
                                        Symbol
                                    </Label>
                                    <Input
                                        id="symbol"
                                        placeholder="Enter Coin Symbol"
                                        value={formData.symbol}
                                        onChange={handleInputChange}
                                        className="h-12 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg font-medium"
                                    />
                                </div>

                                {/* Current Price */}
                                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] items-center gap-x-12 gap-y-2">
                                    <Label htmlFor="currentPrice" className="text-sm font-bold text-foreground/70 uppercase tracking-widest">
                                        Current Price
                                    </Label>
                                    <Input
                                        id="currentPrice"
                                        placeholder="Enter Current Price"
                                        value={formData.currentPrice}
                                        onChange={handleInputChange}
                                        className="h-12 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg font-medium font-mono"
                                    />
                                </div>

                                {/* Quantity */}
                                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] items-center gap-x-12 gap-y-2">
                                    <Label htmlFor="quantity" className="text-sm font-bold text-foreground/70 uppercase tracking-widest">
                                        Quantity
                                    </Label>
                                    <Input
                                        id="quantity"
                                        placeholder="Enter Quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="h-12 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg font-medium font-mono"
                                    />
                                </div>

                                {/* Last Updated */}
                                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] items-center gap-x-12 gap-y-2">
                                    <Label htmlFor="lastUpdated" className="text-sm font-bold text-foreground/70 uppercase tracking-widest">
                                        Last Updated
                                    </Label>
                                    <div className="h-12 px-4 flex items-center bg-muted/40 border border-border rounded-lg text-muted-foreground font-mono text-sm">
                                        {formData.lastUpdated}
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-4 pt-8 border-t border-border">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-11 px-8 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[11px] rounded-lg shadow-sm transition-all flex items-center gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {isLoading ? "Saving..." : "Submit"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 px-8 border-border hover:bg-muted font-black uppercase tracking-widest text-[11px] rounded-lg transition-all flex items-center gap-2"
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
