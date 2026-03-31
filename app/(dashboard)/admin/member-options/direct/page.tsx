"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { Search, CheckCircle2, Clock, List, UserCheck, UserCircle2 } from "lucide-react";
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
import { api } from "@/lib/axios";
import { getMemberStatus } from "@/lib/utils/member-status";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DirectRow {
    _id: string;
    memberId: string;
    fullName: string;
    sponsorId?: {
        _id: string;
        fullName: string;
        memberId: string;
    };
    createdAt: string;
    activationDate: string | null;
    expirationDate?: string | null;
    status: string;
}

export default function MyDirectPage() {
    const [memberId, setMemberId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [filters, setFilters] = useState({
        memberName: "",
        status: "all",
    });

    const [directData, setDirectData] = useState<DirectRow[]>([]);

    const handleFetchDirect = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!memberId) {
            toast.error("Please enter a Member Id");
            return;
        }

        setIsLoading(true);
        setDirectData([]); // Clear previous results

        try {
            const response = await api.get(`/member/direct-members/${memberId}`);

            if (response.data?.status && Array.isArray(response.data.data)) {
                const results = response.data.data;
                setDirectData(results);
                if (results.length === 0) {
                    toast("No direct members found for this ID", { icon: "ℹ️" });
                } else {
                    toast.success(`Found ${results.length} direct member(s)`);
                }
            } else {
                setDirectData([]);
            }
        } catch (error: any) {
            // Axios interceptor already shows the error toast — just log it
            console.error("Fetch direct error:", error);
            setDirectData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    const filteredData = useMemo(() => {
        return directData.filter((row) => {
            const mId = (row.memberId || "").toLowerCase();
            const mName = (row.fullName || "").toLowerCase();
            const calculatedStatus = getMemberStatus(row);

            return (
                mName.includes(filters.memberName.toLowerCase()) &&
                (filters.status === "all" || calculatedStatus === filters.status.toLowerCase())
            );
        });
    }, [directData, filters]);

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
            <PageHeader
                title="My Direct"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "My Direct" },
                ]}
            />

            <div className="w-full min-w-0 flex-1 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <Card className="min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                            <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                                        <UserCheck className="h-4 w-4" />
                                    </div>

                                    <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                        My Direct
                                    </CardTitle>
                                </div>

                                <p className="text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                    View direct member records and filter them quickly.
                                </p>
                            </div>

                            <form
                                onSubmit={handleFetchDirect}
                                className="flex w-full min-w-0 flex-col gap-2 xl:w-auto xl:flex-row"
                            >
                                <div className="relative group w-full min-w-0">
                                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e] transition-colors group-focus-within:text-primary" />
                                    <Input
                                        placeholder="Enter Member Id"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-9 pr-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10 xl:w-[280px]"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-8 shrink-0 rounded-md bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-white shadow-sm transition-all hover:bg-primary/90"
                                >
                                    {isLoading ? "Searching..." : "Submit"}
                                </Button>
                            </form>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 p-3 sm:p-4">
                        <div className="rounded-md border border-[#dce8d3] bg-[#fafcf8] p-3">
                            <div className="mb-2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#5f6851]">
                                    Filters
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="relative group min-w-0">
                                    <Input
                                        placeholder="Filter by Name"
                                        value={filters.memberName}
                                        onChange={(e) => handleFilterChange("memberName", e.target.value)}
                                        className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[11px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                    />
                                </div>

                                <div className="relative group min-w-0">
                                    <Select
                                        value={filters.status}
                                        onValueChange={(val) => handleFilterChange("status", val)}
                                    >
                                        <SelectTrigger className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[11px] shadow-sm focus:ring-primary/10">
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {filteredData.length === 0 ? (
                            <div className="rounded-lg border border-[#dce8d3] shadow-sm">
                                <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center sm:min-h-[240px]">
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 ring-1 ring-[#dce8d3]">
                                        <List className="h-6 w-6 text-[#a1a895]" />
                                    </div>
                                    <p className="text-base font-bold tracking-tight text-[#4d553d] sm:text-lg">
                                        No direct members found
                                    </p>
                                    <p className="mt-1 max-w-md text-xs text-[#7a8270] sm:text-sm">
                                        Search with a valid member ID to view records.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Mobile + Tablet Card View */}
                                <div className="space-y-3 xl:hidden">
                                    {filteredData.map((row, index) => (
                                        <div
                                            key={row._id || index}
                                            className="rounded-lg border border-[#dce8d3] bg-[#fafcf8] p-3 shadow-sm"
                                        >
                                            <div className="mb-2 flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                        Sr. No. {index + 1}
                                                    </p>

                                                    <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#4d553d]">
                                                        <UserCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                                        <span className="truncate">{row.fullName}</span>
                                                    </div>

                                                    <p className="mt-1 break-all text-[11px] font-medium text-primary">
                                                        ID: {row.memberId}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] ${(() => {
                                                        const calculatedStatus = getMemberStatus(row);
                                                        return calculatedStatus === "active"
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                            : "border-amber-200 bg-amber-50 text-amber-700";
                                                    })()}`}
                                                >
                                                    {getMemberStatus(row)}
                                                </span>
                                            </div>

                                            <div className="space-y-2 border-t border-[#e7efdf] pt-2">
                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                    <div className="rounded-md bg-white p-2 text-center">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                            Joining Date
                                                        </p>
                                                        <div className="mt-1 flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#7b836f]">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{formatDate(row.createdAt)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-md bg-white p-2">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                            Activation Date
                                                        </p>
                                                        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-[#7b836f]">
                                                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                            <span>{row.activationDate ? formatDate(row.activationDate) : "N/A"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden overflow-x-auto rounded-lg border border-[#dce8d3] shadow-sm xl:block">
                                    <div className="min-w-[920px]">
                                        <Table>
                                            <TableHeader className="bg-[#f7fbf3]">
                                                <TableRow className="border-b border-[#dce8d3] hover:bg-transparent">
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Sr. No.
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Member Id
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Member Name
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Joining Date
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Activation Date
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Status
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {filteredData.map((row, index) => (
                                                    <TableRow
                                                        key={row._id || index}
                                                        className="border-b border-[#edf3e7] transition-colors hover:bg-[#fbfdf8]"
                                                    >
                                                        <TableCell className="px-3 py-2.5 text-xs font-medium text-[#8a927e]">
                                                            {index + 1}
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-semibold text-primary">
                                                                {row.memberId}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5 text-xs font-medium text-[#5f6851]">
                                                            {row.fullName}
                                                        </TableCell>
                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#7b836f]">
                                                                <Clock className="h-3 w-3" />
                                                                {formatDate(row.createdAt)}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#7b836f]">
                                                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                                {row.activationDate ? formatDate(row.activationDate) : "N/A"}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5 text-right">
                                                            <span
                                                                className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] ${(() => {
                                                                    const calculatedStatus = getMemberStatus(row);
                                                                    return calculatedStatus === "active"
                                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                        : "border-amber-200 bg-amber-50 text-amber-700";
                                                                })()}`}
                                                            >
                                                                {getMemberStatus(row)}
                                                            </span>
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