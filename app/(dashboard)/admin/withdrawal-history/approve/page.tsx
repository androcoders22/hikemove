"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { getAllWithdrawalsAPI } from "@/lib/api/withdrawal";
import {
    CheckCircle2,
    Search,
    Filter,
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

export default function WithdrawalApproveListPage() {
    const [historyData, setHistoryData] = useState<WithdrawalData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

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
                const approved = res.data.data.filter(
                    (item: any) =>
                        item.status.toLowerCase() === "approved" ||
                        item.status.toLowerCase() === "paid"
                );
                setHistoryData(approved);
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
            toast.error("Failed to fetch approved withdrawals");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

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
                title="Withdrawal Approve List"
                breadcrumbs={[
                    { title: "Withdrawal History", href: "#" },
                    { title: "Approved" },
                ]}
            />

            <div className="flex-1 min-w-0 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <Card className="min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                            <div className="min-w-0 space-y-2">
                                <div className="flex items-start gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/15">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    </div>

                                    <div className="min-w-0 space-y-0.5">
                                        <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#3f5747] sm:text-lg">
                                            Approved Withdrawals
                                        </CardTitle>
                                        <p className="text-[11px] font-medium text-[#738177] sm:text-xs">
                                            Approved and finalized withdrawal records.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full min-w-0 flex-col gap-2 xl:w-auto xl:flex-row">
                                <div className="relative group w-full min-w-0">
                                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8d9a90] transition-colors group-focus-within:text-emerald-600" />
                                    <Input
                                        type="text"
                                        placeholder="Search Member ID, Name, Wallet..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-9 pr-3 text-[13px] shadow-sm transition-all placeholder:text-[#9da89f] focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 xl:w-[280px]"
                                    />
                                </div>

                                <Button
                                    variant="outline"
                                    className="h-8 shrink-0 rounded-md border-[#dce8d3] bg-white px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-[#56655b] shadow-sm transition-all hover:bg-emerald-500/5 hover:text-emerald-600"
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
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-600" />
                                </div>
                                <p className="text-sm font-semibold text-[#3f5747]">
                                    Loading records...
                                </p>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center sm:min-h-[240px]">
                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/5 ring-1 ring-[#dce8d3]">
                                    <Search className="h-6 w-6 text-[#a3afa6]" />
                                </div>
                                <p className="text-base font-bold tracking-tight text-[#3f5747] sm:text-lg">
                                    No matches found
                                </p>
                                <p className="mt-1 max-w-md text-xs text-[#738177] sm:text-sm">
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

                                                        <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#445347]">
                                                            <UserCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                                                            <span className="truncate">
                                                                {getMemberStr(row.member, "fullName")}
                                                            </span>
                                                        </div>

                                                        <p className="mt-1 break-all text-[11px] font-medium text-[#5f6e62]">
                                                            ID: {getMemberStr(row.member, "memberId")}
                                                        </p>
                                                    </div>

                                                    <Badge className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] text-emerald-700 hover:bg-emerald-50">
                                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                                        Approved
                                                    </Badge>
                                                </div>

                                                <div className="space-y-2 border-t border-[#e7efdf] pt-2">
                                                    <div className="flex items-start gap-2 text-[11px] text-[#5f6e62]">
                                                        <Wallet className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                                        <span className="break-all">{row.walletAddress}</span>
                                                    </div>

                                                    <div className="flex items-start gap-2 text-[11px] text-[#78867b]">
                                                        <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                                        <span>{formatDate(row.createdAt)}</span>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3">
                                                        <div className="rounded-md bg-white p-2 text-center">
                                                            <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                                Amount
                                                            </p>
                                                            <p className="mt-1 text-xs font-semibold text-[#445347]">
                                                                ${Number(row.amount).toFixed(2)}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-md bg-white p-2 text-center">
                                                            <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                                Charge
                                                            </p>
                                                            <p className="mt-1 text-xs font-medium text-[#879388]">
                                                                ${adminCharge.toFixed(2)}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-md bg-emerald-500/10 p-2 text-center">
                                                            <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-emerald-700">
                                                                Net
                                                            </p>
                                                            <p className="mt-1 text-xs font-bold text-emerald-700">
                                                                ${netPayable.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden min-w-0 overflow-x-auto xl:block">
                                    <Table>
                                        <TableHeader className="bg-[#f7fbf8]">
                                            <TableRow className="border-b border-[#dce8d3] hover:bg-transparent">
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#59685d]">
                                                    Sr. No.
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#59685d]">
                                                    Member ID
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#59685d]">
                                                    Member Name
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#59685d]">
                                                    Wallet Address
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#59685d]">
                                                    Amount
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#59685d]">
                                                    Charge
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#59685d]">
                                                    Net
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#59685d]">
                                                    Request Time
                                                </TableHead>
                                                <TableHead className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-[#59685d]">
                                                    Status
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
                                                        className="border-b border-[#edf3ee] transition-colors hover:bg-[#f9fdf9]"
                                                    >
                                                        <TableCell className="px-3 py-2.5 text-center text-xs font-medium text-[#88958b]">
                                                            {index + 1}
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-semibold text-[#445347]">
                                                                {getMemberStr(row.member, "memberId")}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-medium text-[#5f6e62]">
                                                                {getMemberStr(row.member, "fullName")}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="max-w-[180px] truncate rounded-md border border-[#e5eee7] bg-[#fafdfb] px-2 py-1 font-mono text-[10px] text-[#78867b]">
                                                                {row.walletAddress}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-semibold text-[#445347]">
                                                                ${Number(row.amount).toFixed(2)}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-medium text-[#879388]">
                                                                ${adminCharge.toFixed(2)}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-700">
                                                                ${netPayable.toFixed(2)}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-[10px] leading-4 text-[#78867b]">
                                                                {formatDate(row.createdAt)}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5 text-right">
                                                            <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] text-emerald-700 hover:bg-emerald-50">
                                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                                Approved
                                                            </Badge>
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