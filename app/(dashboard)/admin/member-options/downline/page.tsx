"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Users, Search, CheckCircle2, Clock, List, UserCircle2 } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

interface DownlineRow {
    srNo: number;
    memberId: string;
    memberName: string;
    memberPackage: string;
    joiningDate: string;
    activationDate: string;
    status: string;
}

export default function MemberDownlinePage() {
    const [downlineId, setDownlineId] = useState("");
    const [selectType, setSelectType] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [filters, setFilters] = useState({
        memberId: "",
        memberName: "",
        joiningDate: "",
        activationDate: "",
        status: "",
    });

    const [downlineData, setDownlineData] = useState<DownlineRow[]>([]);

    const handleFetchDownline = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!downlineId) {
            toast.error("Please enter a Downline Id");
            return;
        }

        setIsLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            setDownlineData([]);
            toast.success("Downline data retrieved");
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Member Downline"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "Member Downline" },
                ]}
            />

            <div className="w-full min-w-0 flex-1 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <Card className="min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                            <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                                        <Users className="h-4 w-4" />
                                    </div>

                                    <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                        Member Downline
                                    </CardTitle>
                                </div>

                                <p className="text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                    Search and view downline members with quick filters.
                                </p>
                            </div>

                            <form
                                onSubmit={handleFetchDownline}
                                className="flex w-full min-w-0 flex-col gap-2 xl:w-auto"
                            >
                                <div className="grid grid-cols-1 gap-2 xl:grid-cols-[170px_minmax(260px,300px)_auto]">
                                    <Select value={selectType} onValueChange={setSelectType}>
                                        <SelectTrigger className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white text-[11px] shadow-sm focus:ring-2 focus:ring-primary/10">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="direct">Direct Downline</SelectItem>
                                            <SelectItem value="all">All Downline</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <div className="relative group min-w-0">
                                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e] transition-colors group-focus-within:text-primary" />
                                        <Input
                                            placeholder="Enter Downline Id"
                                            value={downlineId}
                                            onChange={(e) => setDownlineId(e.target.value)}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-9 pr-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-8 shrink-0 rounded-md bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.05em] text-white shadow-sm transition-all hover:bg-primary/90"
                                    >
                                        {isLoading ? "Searching..." : "Submit"}
                                    </Button>
                                </div>
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

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                                {Object.keys(filters).map((key) => (
                                    <div key={key} className="relative group min-w-0">
                                        <Input
                                            placeholder={key
                                                .replace(/([A-Z])/g, " $1")
                                                .replace(/^./, (str) => str.toUpperCase())}
                                            value={filters[key as keyof typeof filters]}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    key as keyof typeof filters,
                                                    e.target.value
                                                )
                                            }
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white px-3 text-[11px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {downlineData.length === 0 ? (
                            <div className="rounded-lg border border-[#dce8d3] shadow-sm">
                                <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center sm:min-h-[240px]">
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 ring-1 ring-[#dce8d3]">
                                        <List className="h-6 w-6 text-[#a1a895]" />
                                    </div>
                                    <p className="text-base font-bold tracking-tight text-[#4d553d] sm:text-lg">
                                        No downline members found
                                    </p>
                                    <p className="mt-1 max-w-md text-xs text-[#7a8270] sm:text-sm">
                                        Search with a valid downline ID to view records.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Mobile + Tablet Card View */}
                                <div className="space-y-3 xl:hidden">
                                    {downlineData.map((row) => (
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
                                                        <span className="truncate">{row.memberName}</span>
                                                    </div>

                                                    <p className="mt-1 break-all text-[11px] font-medium text-primary">
                                                        ID: {row.memberId}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] ${
                                                        row.status === "Active"
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                            : "border-amber-200 bg-amber-50 text-amber-700"
                                                    }`}
                                                >
                                                    {row.status}
                                                </span>
                                            </div>

                                            <div className="space-y-2 border-t border-[#e7efdf] pt-2">
                                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                                    <div className="rounded-md bg-white p-2 text-center">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                            Package
                                                        </p>
                                                        <p className="mt-1 text-[11px] font-bold text-amber-700">
                                                            {row.memberPackage}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-md bg-white p-2">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                            Joining Date
                                                        </p>
                                                        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-[#7b836f]">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{row.joiningDate}</span>
                                                        </div>
                                                    </div>

                                                    <div className="rounded-md bg-white p-2">
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                            Activation Date
                                                        </p>
                                                        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-[#7b836f]">
                                                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                            <span>{row.activationDate}</span>
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
                                                        Package
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
                                                {downlineData.map((row) => (
                                                    <TableRow
                                                        key={row.srNo}
                                                        className="border-b border-[#edf3e7] transition-colors hover:bg-[#fbfdf8]"
                                                    >
                                                        <TableCell className="px-3 py-2.5 text-xs font-medium text-[#8a927e]">
                                                            {row.srNo}
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-semibold text-primary">
                                                                {row.memberId}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="text-xs font-medium text-[#5f6851]">
                                                                {row.memberName}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <span className="inline-flex rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                                                {row.memberPackage}
                                                            </span>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#7b836f]">
                                                                <Clock className="h-3 w-3" />
                                                                {row.joiningDate}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#7b836f]">
                                                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                                {row.activationDate}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5 text-right">
                                                            <span
                                                                className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] ${
                                                                    row.status === "Active"
                                                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                                        : "border-amber-200 bg-amber-50 text-amber-700"
                                                                }`}
                                                            >
                                                                {row.status}
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