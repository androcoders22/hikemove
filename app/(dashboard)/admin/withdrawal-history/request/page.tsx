"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
    getAllWithdrawalsAPI,
    approveWithdrawalAPI,
    rejectWithdrawalAPI,
} from "@/lib/api/withdrawal";
import {
    Search,
    Filter,
    History,
    CheckCircle2,
    XCircle,
    Wallet,
    CalendarClock,
    UserCircle2,
} from "lucide-react";
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

    const getMemberStr = (
        member: any,
        key: "memberId" | "name" | "fullName"
    ) => {
        if (typeof member === "object" && member !== null) {
            return member[key] || "N/A";
        }
        return key === "memberId" ? member : "N/A";
    };

    const filteredData = historyData.filter((item) => {
        const memberId = getMemberStr(item.member, "memberId").toLowerCase();
        const fullName = getMemberStr(item.member, "fullName").toLowerCase();
        const wallet = (item.walletAddress || "").toLowerCase();
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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })} ${date.toLocaleTimeString("en-US")}`;
    };

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Withdrawal Request List"
                breadcrumbs={[
                    { title: "Withdrawal History", href: "#" },
                    { title: "Requests" },
                ]}
            />

            <div className="flex-1 min-w-0 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <Card className="min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-[#dce8d3] bg-[#fafcf8] px-3 pb-0 pt-3 sm:px-4 sm:pt-4">
                        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                            <div className="min-w-0 space-y-2">
                                <div className="flex items-start gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7db538]/10 ring-1 ring-[#7db538]/15">
                                        <History className="h-4 w-4 text-[#7db538]" />
                                    </div>

                                    <div className="min-w-0 space-y-0.5">
                                        <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                            Withdrawal Requests
                                        </CardTitle>
                                        <p className="text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                            Pending withdrawal requests from members.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full min-w-0 flex-col gap-2 xl:w-auto xl:flex-row">
                                <div className="relative group w-full min-w-0">
                                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e] transition-colors group-focus-within:text-[#7db538]" />
                                    <Input
                                        type="text"
                                        placeholder="Search Member ID, Name, Wallet..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-9 pr-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-[#7db538]/40 focus:ring-2 focus:ring-[#7db538]/10 xl:w-[280px]"
                                    />
                                </div>

                                <Button
                                    variant="outline"
                                    className="h-8 shrink-0 rounded-md border-[#dce8d3] bg-white px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-[#5b624f] shadow-sm transition-all hover:bg-[#7db538]/5 hover:text-[#7db538]"
                                >
                                    <Filter className="mr-1.5 h-3.5 w-3.5" />
                                    Filter
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center sm:min-h-[240px]">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#7db538]/10">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#7db538]/30 border-t-[#7db538]" />
                                </div>
                                <p className="text-sm font-semibold text-[#4d553d]">
                                    Loading requests...
                                </p>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center sm:min-h-[240px]">
                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#7db538]/8 ring-1 ring-[#dce8d3]">
                                    <Search className="h-6 w-6 text-[#a1a895]" />
                                </div>
                                <p className="text-base font-bold tracking-tight text-[#4d553d] sm:text-lg">
                                    No matches found
                                </p>
                                <p className="mt-1 max-w-md text-xs text-[#7a8270] sm:text-sm">
                                    Try adjusting your search or filters.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Mobile + Tablet Card View */}
                                <div className="space-y-3 p-3 xl:hidden">
                                    {filteredData.map((row, index) => {
                                        const adminCharge = 0;
                                        const netPayable = Number(row.amount) - adminCharge;

                                        return (
                                            <div
                                                key={row._id}
                                                className="rounded-lg border border-[#dce8d3] bg-[#fafcf8] p-3 shadow-sm"
                                            >
                                                <div className="mb-2 flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                            Sr. No. {index + 1}
                                                        </p>
                                                        <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#4e5640]">
                                                            <UserCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                                            <span className="truncate">
                                                                {getMemberStr(row.member, "fullName")}
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 text-[11px] font-medium text-[#5f6851] break-all">
                                                            ID: {getMemberStr(row.member, "memberId")}
                                                        </p>
                                                    </div>

                                                    <Badge className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] text-amber-700 hover:bg-amber-50">
                                                        Pending
                                                    </Badge>
                                                </div>

                                                <div className="space-y-2 border-t border-[#e7efdf] pt-2">
                                                    <div className="flex items-start gap-2 text-[11px] text-[#5f6851]">
                                                        <Wallet className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7db538]" />
                                                        <span className="break-all">{row.walletAddress}</span>
                                                    </div>

                                                    <div className="flex items-start gap-2 text-[11px] text-[#7b836f]">
                                                        <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7db538]" />
                                                        <span>{formatDate(row.createdAt)}</span>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3">
                                                        <div className="rounded-md bg-white p-2 text-center">
                                                            <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                                Amount
                                                            </p>
                                                            <p className="mt-1 text-xs font-semibold text-[#49513b]">
                                                                ${Number(row.amount).toFixed(2)}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-md bg-white p-2 text-center">
                                                            <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                                Charge
                                                            </p>
                                                            <p className="mt-1 text-xs font-medium text-[#8a927e]">
                                                                ${adminCharge.toFixed(2)}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-md bg-[#7db538]/10 p-2 text-center">
                                                            <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#67992d]">
                                                                Net
                                                            </p>
                                                            <p className="mt-1 text-xs font-bold text-[#67992d]">
                                                                ${netPayable.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap justify-end gap-2 pt-2">
                                                        <Button
                                                            size="sm"
                                                            disabled={processingId === row._id}
                                                            onClick={() => handleApprove(row._id)}
                                                            className="h-7 rounded-md bg-emerald-500 px-2.5 text-[10px] font-bold text-white shadow-sm hover:bg-emerald-600"
                                                        >
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            {processingId === row._id ? "..." : "Confirm"}
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            disabled={processingId === row._id}
                                                            onClick={() => handleReject(row._id)}
                                                            className="h-7 rounded-md px-2.5 text-[10px] font-bold shadow-sm"
                                                        >
                                                            <XCircle className="mr-1 h-3 w-3" />
                                                            {processingId === row._id ? "..." : "Reject"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden min-w-0 overflow-x-auto xl:block">
                                    <Table>
                                        <TableHeader className="bg-[#f7fbf3]">
                                            <TableRow className="border-b border-[#dce8d3] hover:bg-transparent">
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                    Sr. No.
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                    Member ID
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                    Member Name
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                    Wallet Address
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                    Amount
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                    Charge
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                    Net
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                    Request Time
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                    Action
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {filteredData.map((row, index) => {
                                                const adminCharge = 0;
                                                const netPayable = Number(row.amount) - adminCharge;

                                                return (
                                                    <TableRow
                                                        key={row._id}
                                                        className="border-b border-[#edf3e7] transition-colors hover:bg-[#fbfdf8]"
                                                    >
                                                        <TableCell className="px-3 py-2.5 text-center text-xs font-medium text-[#8a927e]">
                                                            {index + 1}
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-semibold text-[#4e5640]">
                                                                {getMemberStr(row.member, "memberId")}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-medium text-[#5f6851]">
                                                                {getMemberStr(row.member, "fullName")}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="max-w-[180px] truncate rounded-md border border-[#e4eddc] bg-[#fafcf8] px-2 py-1 font-mono text-[10px] text-[#7b836f]">
                                                                {row.walletAddress}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-semibold text-[#49513b]">
                                                                ${Number(row.amount).toFixed(2)}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-medium text-[#8a927e]">
                                                                ${adminCharge.toFixed(2)}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="inline-flex rounded-md bg-[#7db538]/10 px-2 py-0.5 text-xs font-bold text-[#67992d]">
                                                                ${netPayable.toFixed(2)}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-[10px] leading-4 text-[#7b836f]">
                                                                {formatDate(row.createdAt)}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5 text-right">
                                                            <div className="flex flex-wrap items-center justify-end gap-1.5">
                                                                <Badge className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] text-amber-700 hover:bg-amber-50">
                                                                    Pending
                                                                </Badge>

                                                                <Button
                                                                    size="sm"
                                                                    disabled={processingId === row._id}
                                                                    onClick={() => handleApprove(row._id)}
                                                                    className="h-7 rounded-md bg-emerald-500 px-2.5 text-[10px] font-bold text-white shadow-sm transition-all hover:bg-emerald-600"
                                                                >
                                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                                    {processingId === row._id ? "..." : "Confirm"}
                                                                </Button>

                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    disabled={processingId === row._id}
                                                                    onClick={() => handleReject(row._id)}
                                                                    className="h-7 rounded-md px-2.5 text-[10px] font-bold shadow-sm"
                                                                >
                                                                    <XCircle className="mr-1 h-3 w-3" />
                                                                    {processingId === row._id ? "..." : "Reject"}
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}