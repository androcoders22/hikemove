"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
    Search,
    History,
    CheckCircle2,
    UserCircle2,
    CalendarClock,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { getLedgerByMemberIdAPI } from "@/lib/api/ledger";
import { Badge } from "@/components/ui/badge";

interface WalletHistoryRow {
    srNo: number;
    remark: string;
    date: string;
    type: string;
    total: number;
    adminCharge: number;
    activity: string;
    netAmount: number;
    status: string;
}

export default function WalletHistoryPage() {
    const [walletId, setWalletId] = useState("");
    const [currentBalance, setCurrentBalance] = useState(0);
    const [historyData, setHistoryData] = useState<WalletHistoryRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFetchHistory = async (e?: React.FormEvent) => {
        e?.preventDefault();

        const normalizedId = walletId.trim().toUpperCase();

        if (!normalizedId) {
            toast.error("Please enter a Member Id");
            return;
        }

        setIsLoading(true);

        try {
            const response = await getLedgerByMemberIdAPI(normalizedId);
            const payload = response.data?.data;

            if (response.data?.status !== true) {
                throw new Error(response.data?.message || "Failed to fetch wallet history");
            }

            const ledgerEntries = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.ledger)
                    ? payload.ledger
                    : Array.isArray(payload?.records)
                        ? payload.records
                        : [];

            const derivedBalance =
                typeof payload === "object" && !Array.isArray(payload)
                    ? payload.walletBalance ?? payload.currentBalance ?? payload.balance ?? 0
                    : 0;

            setCurrentBalance(Number(derivedBalance) || 0);

            const formattedRows: WalletHistoryRow[] = ledgerEntries.map((entry: any, index: number) => {
                const entryType = (entry.entryType || entry.type || "credit").toString().toLowerCase();
                const amount = Number(entry.amount ?? entry.total ?? entry.netAmount ?? 0);
                const adminCharge = Number(entry.adminCharge ?? 0);
                const netAmount = Number(entry.netAmount ?? amount - adminCharge);

                return {
                    srNo: index + 1,
                    remark: entry.remarks || entry.remark || entry.description || "No remark provided",
                    date: entry.createdAt
                        ? new Date(entry.createdAt).toLocaleString()
                        : entry.date || "--",
                    type: entryType === "debit" ? "Debit" : "Credit",
                    total: amount,
                    adminCharge,
                    activity: entry.ledgerType || entry.activity || "--",
                    netAmount,
                    status: entry.status || "Pending",
                };
            });

            setHistoryData(formattedRows);
            toast.success(response.data?.message || "Wallet history retrieved successfully");
        } catch (error: any) {
            const serverMessage = error.response?.data?.message || error.message;
            toast.error(serverMessage || "Failed to fetch wallet history");
            setHistoryData([]);
            setCurrentBalance(0);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Wallet History"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "Wallet History" },
                ]}
            />

            <div className="w-full min-w-0 flex-1 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <Card className="min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                                    <History className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                    <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                        Wallet History
                                    </CardTitle>
                                    <p className="mt-0.5 text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                        Current Wallet Balance: ${currentBalance.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <form
                                onSubmit={handleFetchHistory}
                                className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end"
                            >
                                <div className="relative group w-full min-w-0 sm:max-w-xs">
                                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e] transition-colors group-focus-within:text-primary" />
                                    <Input
                                        placeholder="Enter Member Id"
                                        value={walletId}
                                        onChange={(e) => setWalletId(e.target.value.toUpperCase())}
                                        className="h-9 w-full rounded-md border-[#dce8d3] bg-white pl-9 pr-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-9 shrink-0 rounded-md bg-primary px-4 text-[10px] font-bold uppercase tracking-[0.05em] text-white shadow-sm transition-all hover:bg-primary/90"
                                >
                                    {isLoading ? "Searching..." : "Search"}
                                </Button>
                            </form>
                        </div>
                    </CardHeader>

                    <CardContent className="p-3 sm:p-4">
                        {historyData.length === 0 ? (
                            <div className="rounded-lg border border-[#dce8d3] shadow-sm">
                                <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center sm:min-h-[240px]">
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 ring-1 ring-[#dce8d3]">
                                        <Search className="h-6 w-6 text-[#a1a895]" />
                                    </div>
                                    <p className="text-base font-bold tracking-tight text-[#4d553d] sm:text-lg">
                                        No history available
                                    </p>
                                    <p className="mt-1 max-w-md text-xs text-[#7a8270] sm:text-sm">
                                        Enter a member ID above and submit to view wallet history.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Mobile + Tablet Card View */}
                                <div className="space-y-3 xl:hidden">
                                    {historyData.map((row) => (
                                        <div
                                            key={row.srNo}
                                            className="rounded-lg border border-[#dce8d3] bg-[#fafcf8] p-3 shadow-sm"
                                        >
                                            <div className="mb-2 flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                        Sr. No. {row.srNo}
                                                    </p>

                                                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#4d553d]">
                                                        <UserCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                                        <span className="truncate">{row.activity}</span>
                                                    </div>
                                                </div>

                                                <Badge className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] text-emerald-700 hover:bg-emerald-50">
                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                    {row.status}
                                                </Badge>
                                            </div>

                                            <div className="space-y-2 border-t border-[#e7efdf] pt-2">
                                                <div className="text-xs italic text-[#6b7280]">
                                                    "{row.remark}"
                                                </div>

                                                <div className="flex items-start gap-2 text-[11px] text-[#7b836f]">
                                                    <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                                    <span>{row.date}</span>
                                                </div>

                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                                    <div className="rounded-md bg-white p-2 text-center">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                            Type
                                                        </p>
                                                        <span
                                                            className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] ${row.type === "Credit"
                                                                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                    : "border border-rose-200 bg-rose-50 text-rose-700"
                                                                }`}
                                                        >
                                                            {row.type}
                                                        </span>
                                                    </div>

                                                    <div className="rounded-md bg-white p-2 text-center">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                            Total
                                                        </p>
                                                        <p className="mt-1 text-xs font-semibold text-[#49513b]">
                                                            ${row.total.toFixed(2)}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-md bg-primary/10 p-2 text-center">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-primary">
                                                            Net Amount
                                                        </p>
                                                        <p className="mt-1 text-xs font-bold text-primary">
                                                            ${row.netAmount.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="rounded-md bg-white p-2 text-center">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                            Admin Charge
                                                        </p>
                                                        <p className="mt-1 text-xs text-rose-600">
                                                            -${row.adminCharge.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden overflow-x-auto rounded-lg border border-[#dce8d3] shadow-sm xl:block">
                                    <div className="min-w-[1100px]">
                                        <Table>
                                            <TableHeader className="bg-[#f7fbf3]">
                                                <TableRow className="border-b border-[#dce8d3] hover:bg-transparent">
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Sr. No.
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Remark
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Date
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Type
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Total
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Admin Charge
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Activity
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Net Amount
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Status
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {historyData.map((row) => (
                                                    <TableRow
                                                        key={row.srNo}
                                                        className="border-b border-[#edf3e7] transition-colors hover:bg-[#fbfdf8]"
                                                    >
                                                        <TableCell className="px-3 py-2.5 text-xs font-medium text-[#8a927e]">
                                                            {row.srNo}
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs italic text-[#6b7280]">
                                                                "{row.remark}"
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-[10px] font-mono font-semibold text-[#7b836f]">
                                                                {row.date}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <span
                                                                className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] ${row.type === "Credit"
                                                                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                        : "border border-rose-200 bg-rose-50 text-rose-700"
                                                                    }`}
                                                            >
                                                                {row.type}
                                                            </span>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-semibold text-[#49513b]">
                                                                ${row.total.toFixed(2)}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs text-rose-600">
                                                                -${row.adminCharge.toFixed(2)}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-medium text-[#5f6851]">
                                                                {row.activity}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-sm font-bold text-primary">
                                                                ${row.netAmount.toFixed(2)}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5 text-right">
                                                            <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] text-emerald-700 hover:bg-emerald-50">
                                                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                                                {row.status}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}