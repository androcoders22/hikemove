"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
    Search,
    History,
    CheckCircle2,
    SlidersHorizontal,
    Save,
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
import { checkMemberIdAPI } from "@/lib/api/member-topup";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

interface WalletHistoryRow {
    srNo: number;
    remark: string;
    date: string;
    type: string;
    total: number;
    adminCharge: number;
    tdsCharge: number;
    activity: string;
    netAmount: number;
    status: string;
}

export default function WalletHistoryPage() {
    const [walletId, setWalletId] = useState("");
    const [currentBalance, setCurrentBalance] = useState(0);
    const [historyData, setHistoryData] = useState<WalletHistoryRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);

    const [filters, setFilters] = useState({
        remark: "",
        date: "",
        type: "",
        total: "",
        adminCharge: "",
        tdsCharge: "",
        activity: "",
        status: "",
    });

    const handleFetchHistory = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!walletId) {
            toast.error("Please enter a Wallet Id");
            return;
        }

        setIsLoading(true);

        try {
            const memberRes = await checkMemberIdAPI(walletId);

            if (memberRes.data?.status) {
                setCurrentBalance(0);
            }

            setHistoryData([
                {
                    srNo: 1,
                    remark: "Wallet Credit by Admin",
                    date: "2026-03-02 14:20:11",
                    type: "Credit",
                    total: 100.0,
                    adminCharge: 0.0,
                    tdsCharge: 0.0,
                    activity: "Manual Update",
                    netAmount: 100.0,
                    status: "Completed",
                },
                {
                    srNo: 2,
                    remark: "Service Fee Deduction",
                    date: "2026-03-01 10:15:45",
                    type: "Debit",
                    total: 10.0,
                    adminCharge: 0.0,
                    tdsCharge: 0.0,
                    activity: "System Charge",
                    netAmount: 10.0,
                    status: "Completed",
                },
            ]);

            toast.success("Wallet history retrieved successfully");
            setOpenFilterModal(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch wallet history");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetPopupFields = () => {
        setWalletId("");
        setFilters({
            remark: "",
            date: "",
            type: "",
            total: "",
            adminCharge: "",
            tdsCharge: "",
            activity: "",
            status: "",
        });
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
                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

                            <Dialog open={openFilterModal} onOpenChange={setOpenFilterModal}>
                                <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        className="h-8 w-full rounded-md bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-white shadow-sm transition-all hover:bg-primary/90 sm:w-auto"
                                    >
                                        <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
                                        Search / Filter
                                    </Button>
                                </DialogTrigger>

                                <DialogContent
                                    showCloseButton={false}
                                    className="w-[96vw] max-w-[980px] border-0 bg-transparent p-0 shadow-none"
                                >
                                    <div className="mx-auto flex max-h-[85vh] w-full flex-col overflow-hidden rounded-xl border border-[#dce8d3] bg-[#f8fbf5] shadow-xl">
                                        <div className="flex items-center justify-between border-b border-[#e4eddc] bg-[#f7fbf3] px-4 py-3 sm:px-5 sm:py-4">
                                            <h2 className="text-[13px] font-extrabold uppercase tracking-[0.06em] text-[#4d553d] sm:text-[15px]">
                                                Wallet Search Panel
                                            </h2>

                                            <DialogClose asChild>
                                                <button
                                                    type="button"
                                                    className="rounded-md p-1.5 text-[#8a927e] transition hover:bg-[#eef5e7] hover:text-[#4d553d]"
                                                >
                                                    ✕
                                                </button>
                                            </DialogClose>
                                        </div>

                                        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                                            <div className="space-y-6">
                                                <section>
                                                    <div className="mb-4 flex items-center gap-3">
                                                        <h3 className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                                                            Wallet Search
                                                        </h3>
                                                        <div className="h-px flex-1 bg-[#e4eddc]" />
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                                                        <div className="space-y-1.5">
                                                            <Label className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#5f6851]">
                                                                Wallet Id
                                                            </Label>
                                                            <Input
                                                                placeholder="Enter Wallet Id"
                                                                value={walletId}
                                                                onChange={(e) => setWalletId(e.target.value)}
                                                                className="h-8 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] shadow-sm placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#5f6851]">
                                                                Current Balance
                                                            </Label>
                                                            <Input
                                                                value={`$${currentBalance.toFixed(2)}`}
                                                                readOnly
                                                                className="h-8 rounded-md border-[#dce8d3] bg-[#f3f7ef] px-3 text-[13px] text-[#6f7664] shadow-sm"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#5f6851]">
                                                                Search Action
                                                            </Label>
                                                            <Button
                                                                type="button"
                                                                onClick={() => handleFetchHistory()}
                                                                disabled={isLoading}
                                                                className="h-8 w-full rounded-md bg-primary text-[10px] font-bold uppercase tracking-[0.05em] text-white hover:bg-primary/90"
                                                            >
                                                                {isLoading ? "Processing..." : "Submit Search"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </section>

                                                <section>
                                                    <div className="mb-4 flex items-center gap-3">
                                                        <h3 className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                                                            Filter Fields
                                                        </h3>
                                                        <div className="h-px flex-1 bg-[#e4eddc]" />
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                                        {(Object.keys(filters) as Array<keyof typeof filters>).map((key) => (
                                                            <div key={key} className="min-w-0 space-y-1.5">
                                                                <Label className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#5f6851]">
                                                                    {key
                                                                        .replace(/([A-Z])/g, " $1")
                                                                        .replace(/^./, (str) => str.toUpperCase())}
                                                                </Label>
                                                                <Input
                                                                    placeholder={`Enter ${key
                                                                        .replace(/([A-Z])/g, " $1")
                                                                        .toLowerCase()}`}
                                                                    value={filters[key]}
                                                                    onChange={(e) =>
                                                                        handleFilterChange(key, e.target.value)
                                                                    }
                                                                    className="h-8 rounded-md border-[#dce8d3] bg-white px-3 text-[13px] shadow-sm placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>
                                        </div>

                                        <div className="flex flex-col-reverse gap-2 border-t border-[#e4eddc] bg-[#f7fbf3] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={resetPopupFields}
                                                className="h-8 rounded-md border-[#dce8d3] bg-white px-3 text-[10px] font-bold uppercase tracking-[0.04em] text-[#5b624f] shadow-sm hover:bg-[#f1f7eb]"
                                            >
                                                Reset
                                            </Button>

                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                                <DialogClose asChild>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="h-8 px-3 text-[10px] font-semibold text-[#4b5563] hover:bg-[#eef5e7]"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </DialogClose>

                                                <Button
                                                    type="button"
                                                    onClick={() => handleFetchHistory()}
                                                    disabled={isLoading}
                                                    className="h-8 rounded-md bg-primary px-4 text-[10px] font-bold text-white hover:bg-primary/90"
                                                >
                                                    <Save className="mr-1.5 h-3.5 w-3.5" />
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
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
                                        Click the search button above to open wallet search and filters.
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
                                                            className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] ${
                                                                row.type === "Credit"
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

                                                    <div className="rounded-md bg-white p-2 text-center">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                            TDS Charge
                                                        </p>
                                                        <p className="mt-1 text-xs text-rose-600">
                                                            -${row.tdsCharge.toFixed(2)}
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
                                                        TDS Charge
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
                                                                className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] ${
                                                                    row.type === "Credit"
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
                                                            <div className="text-xs text-rose-600">
                                                                -${row.tdsCharge.toFixed(2)}
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