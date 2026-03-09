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
import toast from "react-hot-toast";
import { Wallet } from "lucide-react";

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
                action,
                amount: Number(amount),
                remark,
            };

            const res = await updateWalletAPI(payload);

            if (res.data?.status) {
                toast.success(res.data?.message || "Wallet updated successfully!");
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
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Wallet Update"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "Wallet Update" },
                ]}
            />

            <div className="w-full min-w-0 flex-1 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <Card className="min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                                <Wallet className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                                <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                    Wallet Update
                                </CardTitle>
                                <p className="mt-0.5 text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                    Credit or debit wallet balance for a member.
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-3 sm:p-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="rounded-md border border-[#dce8d3] bg-[#fafcf8] p-3">
                                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="memberId"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Member Identifier
                                        </Label>
                                        <Input
                                            id="memberId"
                                            placeholder="Enter Member ID"
                                            value={memberId}
                                            onChange={(e) => setMemberId(e.target.value)}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="action"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Transaction Type
                                        </Label>
                                        <Select value={action} onValueChange={setAction}>
                                            <SelectTrigger className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white text-[11px] shadow-sm focus:ring-2 focus:ring-primary/10">
                                                <SelectValue placeholder="Select Credit or Debit" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-md border-[#dce8d3] shadow-lg">
                                                <SelectItem
                                                    value="credit"
                                                    className="py-2 text-[11px] font-bold text-emerald-600"
                                                >
                                                    Credit Wallet
                                                </SelectItem>
                                                <SelectItem
                                                    value="debit"
                                                    className="py-2 text-[11px] font-bold text-rose-600"
                                                >
                                                    Debit Wallet
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="amount"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Adjustment Amount
                                        </Label>
                                        <div className="relative min-w-0">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#8a927e]">
                                                $
                                            </span>
                                            <Input
                                                id="amount"
                                                type="number"
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-7 pr-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="min-w-0 space-y-1.5">
                                        <Label
                                            htmlFor="remark"
                                            className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]"
                                        >
                                            Transaction Note
                                        </Label>
                                        <Input
                                            id="remark"
                                            placeholder="Reason for adjustment..."
                                            value={remark}
                                            onChange={(e) => setRemark(e.target.value)}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-2 border-t border-[#edf3e7] pt-3 sm:flex-row sm:items-center sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setMemberId("");
                                        setAction("");
                                        setAmount("");
                                        setRemark("");
                                    }}
                                    className="h-8 w-full rounded-md border-[#dce8d3] bg-white px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-[#5b624f] shadow-sm transition-all hover:bg-[#f7fbf3] sm:w-auto"
                                >
                                    Reset
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-8 w-full rounded-md bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-white shadow-sm transition-all hover:bg-primary/90 sm:w-auto"
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