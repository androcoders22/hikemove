"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { updateWalletAPI } from "@/lib/api/withdrawal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Info, ShieldCheck, History } from "lucide-react";

export default function WalletUpdatePage() {
    const [memberId, setMemberId] = useState("");
    const [action, setAction] = useState("");
    const [amount, setAmount] = useState("");
    const [remark, setRemark] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!memberId || !action || !amount || !remark) {
            toast.error("Please fill all fields");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                memberId,
                action, // 'credit' or 'debit'
                amount: Number(amount),
                remark
            };
            const res = await updateWalletAPI(payload);
            if (res.data?.status) {
                toast.success(res.data?.message || "Wallet updated successfully!");
                // Reset form
                setMemberId("");
                setAction("");
                setAmount("");
                setRemark("");
            } else {
                toast.error(res.data?.message || "Failed to update wallet");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            <PageHeader
                title="Wallet Update"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "Wallet Update" },
                ]}
            />

            <div className="flex-0 p-6 w-full pt-0">
                <Card className="border-border shadow-sm overflow-hidden bg-white border-border pt-0">
                    <CardHeader className="flex flex-row items-center justify-between p-4 px-6 border-b bg-gray-50/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Wallet className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground">
                                Wallet Credit/Debit Update
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
                                {/* Row 1 */}
                                <div className="space-y-2">
                                    <Label htmlFor="memberId" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        Member Identifier
                                    </Label>
                                    <Input
                                        id="memberId"
                                        placeholder="Enter Member ID"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="action" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        Transaction Type
                                    </Label>
                                    <Select value={action} onValueChange={setAction}>
                                        <SelectTrigger className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all rounded-lg">
                                            <SelectValue placeholder="Select Credit or Debit" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg border-border shadow-xl">
                                            <SelectItem value="credit" className="py-2 cursor-pointer hover:bg-emerald-50 text-emerald-600 font-bold uppercase text-[10px]">
                                                Credit Wallet
                                            </SelectItem>
                                            <SelectItem value="debit" className="py-2 cursor-pointer hover:bg-rose-50 text-rose-600 font-bold uppercase text-[10px]">
                                                Debit Wallet
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Row 2 */}
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        Adjustment Amount
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">$</span>
                                        <Input
                                            id="amount"
                                            type="number"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="h-11 pl-8 bg-white border-border focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all rounded-lg font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="remark" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        Transaction Note
                                    </Label>
                                    <Input
                                        id="remark"
                                        placeholder="Reason for adjustment..."
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        className="h-11 bg-white border-border focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 justify-end border-t border-gray-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setMemberId("");
                                        setAction("");
                                        setAmount("");
                                        setRemark("");
                                    }}
                                    className="h-10 px-6 border-border bg-white hover:bg-gray-50 text-foreground font-black uppercase tracking-widest text-[10px] rounded-lg transition-all"
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-10 px-8 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] rounded-lg shadow-sm transition-all"
                                >
                                    {isLoading ? "Processing..." : "Submit Update"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
