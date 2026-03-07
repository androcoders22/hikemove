"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
    getAllWithdrawalsAPI,
    approveWithdrawalAPI,
    rejectWithdrawalAPI,
} from "@/lib/api/withdrawal";
import { CheckCircle2, XCircle, Search, Filter, History } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MemberInfo {
    memberId?: string;
    name?: string;
    fullName?: string;
}

interface WithdrawalData {
    _id: string;
    member: MemberInfo | string;
    amount: number;
    walletAddress: string;
    status: string;
    createdAt: string;
    remark?: string;
}

export default function WithdrawalRequestListPage() {
    const [historyData, setHistoryData] = useState<WithdrawalData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const getMemberStr = (member: any, key: "memberId" | "name" | "fullName") => {
        if (typeof member === "object" && member !== null) {
            return member[key] || "N/A";
        }
        return key === "memberId" ? member : "N/A";
    };

    const filteredData = historyData.filter((item) => {
        const memberId = getMemberStr(item.member, "memberId").toLowerCase();
        const fullName = getMemberStr(item.member, "fullName").toLowerCase();
        const wallet = item.walletAddress.toLowerCase();
        const search = searchTerm.toLowerCase();
        return (
            memberId.includes(search) ||
            fullName.includes(search) ||
            wallet.includes(search)
        );
    });

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const res = await getAllWithdrawalsAPI();
            if (res.data?.status && res.data?.data) {
                // Filter only pending requests
                const pending = res.data.data.filter(
                    (item: any) => item.status.toLowerCase() === "pending"
                );
                setHistoryData(pending);
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
            toast.error("Failed to fetch withdrawal requests");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            const res = await approveWithdrawalAPI(id);
            if (res.data?.status) {
                toast.success("Withdrawal approved successfully!");
                fetchHistory();
            } else {
                toast.error(res.data?.message || "Failed to approve withdrawal");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);
        try {
            const res = await rejectWithdrawalAPI(id);
            if (res.data?.status) {
                toast.success("Withdrawal rejected successfully!");
                fetchHistory();
            } else {
                toast.error(res.data?.message || "Failed to reject withdrawal");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setProcessingId(null);
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            <PageHeader
                title="Withdrawal Request List"
                breadcrumbs={[
                    { title: "Withdrawal History", href: "#" },
                    { title: "Requests" },
                ]}
            />

            <div className="flex-1 p-6 space-y-6 pt-0">


                <Card className="border-border shadow-md overflow-hidden bg-white/80 backdrop-blur-md border-[#d8e5d0] pt-0">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b bg-gray-50/50">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                                <History className="h-6 w-6 text-[#7db538]" />
                                Withdrawal Requests
                            </CardTitle>
                            <p className="text-xs text-muted-foreground font-medium">Manage and process pending withdrawal requests from members.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#7db538] transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="Search Member ID, Name, Wallet..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-10 w-[300px] bg-white border-[#d8e5d0] rounded-lg shadow-sm focus:ring-2 focus:ring-[#7db538]/20 transition-all"
                                />
                            </div>
                            <Button variant="outline" size="sm" className="h-10 border-[#d8e5d0] bg-white hover:bg-[#7db538]/5 hover:text-[#7db538] px-4 font-bold rounded-lg transition-all">
                                <Filter className="h-4 w-4 mr-2" />
                                FILTER
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            {isLoading ? (
                                <div className="p-12 text-center text-muted-foreground">
                                    <div className="animate-spin h-6 w-6 border-b-2 border-[#7db538] rounded-full mx-auto mb-4"></div>
                                    <p className="text-sm font-medium">Loading pending requests...</p>
                                </div>
                            ) : filteredData.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground">
                                    <div className="p-4 bg-muted/20 rounded-full w-fit mx-auto mb-4">
                                        <Search className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <p className="text-base font-bold text-foreground">No matches found</p>
                                    <p className="text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-[#f8fcf5] border-b border-[#d8e5d0]">
                                        <TableRow className="border-b">
                                            <TableHead className="text-xs font-black uppercase tracking-widest text-foreground py-4 px-4">
                                                SR. NO.
                                            </TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest text-foreground py-4 px-4">
                                                MEMBER ID
                                            </TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest text-foreground py-4 px-4">
                                                MEMBER NAME
                                            </TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest text-foreground py-4 px-4">
                                                WALLET ADDRESS
                                            </TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest text-foreground py-4 px-4">
                                                REQUESTED AMOUNT
                                            </TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest text-foreground py-4 px-4">
                                                ADMIN CHARGE
                                            </TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest text-foreground py-4 px-4">
                                                NET PAYABLE
                                            </TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest text-foreground py-4 px-4">
                                                REQUEST TIME
                                            </TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest text-foreground py-4 px-4 text-right">
                                                STATUS / ACTION
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.map((row, index) => {
                                            const date = new Date(row.createdAt);
                                            const formattedDate = `${date.toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })} ${date.toLocaleTimeString("en-US")}`;

                                            const adminCharge = 0;
                                            const netPayable = Number(row.amount) - adminCharge;

                                            return (
                                                <TableRow
                                                    key={row._id}
                                                    className="hover:bg-gray-50/50 transition-colors border-b"
                                                >
                                                    <TableCell className="text-sm font-medium py-3 px-4 text-muted-foreground text-center">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="text-sm font-semibold py-3 px-4">
                                                        {getMemberStr(row.member, "memberId")}
                                                    </TableCell>
                                                    <TableCell className="text-sm py-3 px-4">
                                                        {getMemberStr(row.member, "fullName")}
                                                    </TableCell>
                                                    <TableCell className="text-xs font-mono text-muted-foreground py-3 px-4 max-w-[200px] truncate">
                                                        {row.walletAddress}
                                                    </TableCell>
                                                    <TableCell className="text-sm font-semibold py-3 px-4">
                                                        ${Number(row.amount).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-sm py-3 px-4 text-muted-foreground">
                                                        ${adminCharge.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-sm font-bold text-primary py-3 px-4">
                                                        ${netPayable.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-xs py-3 px-4 text-muted-foreground">
                                                        {formattedDate}
                                                    </TableCell>
                                                    <TableCell className="py-3 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                disabled={processingId === row._id}
                                                                onClick={() => handleApprove(row._id)}
                                                                className="h-8 px-3 bg-emerald-500 hover:bg-emerald-600 shadow-sm text-white"
                                                            >
                                                                {processingId === row._id ? "..." : "Confirm"}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                disabled={processingId === row._id}
                                                                onClick={() => handleReject(row._id)}
                                                                className="h-8 px-3 shadow-sm"
                                                            >
                                                                {processingId === row._id ? "..." : "Reject"}
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
