"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
    ArrowUpCircle,
    Search,
    Filter,
    Calendar,
    UserCircle2,
    DollarSign,
    RefreshCcw,
    Clock
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
import { Badge } from "@/components/ui/badge";
import { getAllMemberTopupsAPI } from "@/lib/api/admin";
import toast from "react-hot-toast";

interface TopupData {
    _id: string;
    fromMember: {
        memberId: string;
        fullName: string;
    } | string;
    toMember: {
        memberId: string;
        fullName: string;
    } | string;
    amount: number;
    createdAt: string;
}

export default function AdminMemberTopupPage() {
    const [topups, setTopups] = useState<TopupData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);

    const fetchTopups = async (page: number = 1, silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const res = await getAllMemberTopupsAPI(page, limit);
            const d = res.data;
            if (d?.status && d?.data) {
                let dataArray = [];
                let totalP = 1;

                const meta = d.metaData;
                if (meta?.totalPages) {
                    totalP = Number(meta.totalPages);
                }

                if (Array.isArray(d.data)) {
                    dataArray = d.data;
                    if (!meta) totalP = d.totalPages || (d.total ? Math.ceil(d.total / limit) : 1);
                } else if (typeof d.data === "object") {
                    dataArray =
                        d.data.docs || d.data.list || d.data.records || d.data.data || [];
                    if (!meta) totalP = d.data.totalPages || d.data.pages || d.totalPages || (d.data.total ? Math.ceil(d.data.total / limit) : 1);
                }
                setTopups(dataArray);
                const calcTotalPages = totalP > 0 ? totalP : (dataArray.length > 0 ? 1 : 0);
                setTotalPages(calcTotalPages);
                setCurrentPage(page);
            } else {
                setTopups([]);
            }
        } catch (error) {
            console.error("Failed to fetch topups", error);
            toast.error("Failed to load topup history");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTopups(1);
    }, []);

    const getMemberId = (member: any) => {
        if (typeof member === "object" && member !== null) {
            return member.memberId || "N/A";
        }
        return member || "N/A";
    };

    const getMemberName = (member: any) => {
        if (typeof member === "object" && member !== null) {
            return member.fullName || member.name || "N/A";
        }
        return "N/A";
    };

    const filteredData = topups.filter((item) => {
        const fromId = getMemberId(item.fromMember).toLowerCase();
        const toId = getMemberId(item.toMember).toLowerCase();
        const fromName = getMemberName(item.fromMember).toLowerCase();
        const toName = getMemberName(item.toMember).toLowerCase();
        const search = searchTerm.toLowerCase();

        return (
            fromId.includes(search) ||
            toId.includes(search) ||
            fromName.includes(search) ||
            toName.includes(search)
        );
    });

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Member Topup History"
                breadcrumbs={[
                    { title: "Payments", href: "#" },
                    { title: "Member Topup" },
                ]}
            />

            <div className="w-full flex-1 p-3 pt-0 sm:p-4 sm:pt-0">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between px-1">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-[#dce8d3] text-primary shadow-sm">
                            <ArrowUpCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-[#4d553d]">
                                Member Topups
                            </h2>
                            <p className="text-xs font-medium text-[#7a8270]">
                                Total member-to-member topup transactions.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[300px] sm:flex-row">
                        <div className="relative group flex-1">
                            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e] transition-colors group-focus-within:text-primary" />
                            <Input
                                placeholder="Search ID or Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-9 w-full border-[#dce8d3] bg-white pl-9 text-xs shadow-sm focus:ring-primary/20"
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => fetchTopups(currentPage, false)}
                            className="h-9 border-[#dce8d3] bg-white text-xs font-bold uppercase transition-all hover:bg-[#f3f7ef] shadow-sm rounded-lg"
                        >
                            <RefreshCcw className="mr-2 h-3.5 w-3.5" />
                            Refresh
                        </Button>
                    </div>
                </div>

                <Card className="overflow-hidden rounded-xl border border-[#dce8d3] bg-white shadow-md">
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                                <p className="text-sm font-bold text-[#7a8270] animate-pulse">Loading topup data...</p>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-6">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 ring-1 ring-[#dce8d3]">
                                    <ArrowUpCircle className="h-10 w-10 text-[#a1a895]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#4d553d]">No records found</h3>
                                <p className="mt-2 text-sm text-[#7a8270] max-w-sm">
                                    No topup transactions found matching your criteria.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-[#f7fbf3]">
                                        <TableRow className="border-b border-[#dce8d3]">
                                            <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Sr. No.</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Source (From)</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Receiver (To)</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Amount</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Date & Time</TableHead>
                                            <TableHead className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.map((row, idx) => (
                                            <TableRow key={row._id} className="border-b border-[#edf3e7] transition-all hover:bg-[#fbfdf8]">
                                                <TableCell className="px-4 py-3 text-xs font-bold text-[#8a927e]">
                                                    {(currentPage - 1) * limit + idx + 1}
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                                                            <UserCircle2 className="h-4.5 w-4.5" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-[#4d553d]">{getMemberId(row.fromMember)}</div>
                                                            <div className="text-[10px] font-medium text-[#8a927e]">{getMemberName(row.fromMember)}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                                                            <UserCircle2 className="h-4.5 w-4.5" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-[#4d553d]">{getMemberId(row.toMember)}</div>
                                                            <div className="text-[10px] font-medium text-[#8a927e]">{getMemberName(row.toMember)}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5 font-black text-emerald-600">
                                                        <DollarSign className="h-3.5 w-3.5" />
                                                        <span className="text-sm">{row.amount.toLocaleString()}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4e5640]">
                                                        <Clock className="h-3.5 w-3.5 text-[#8a927e]" />
                                                        {new Date(row.createdAt).toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-3 text-right">
                                                    <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-700">
                                                        Completed
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                        {totalPages > 0 && (
                            <div className="p-4 border-t border-[#dce8d3] flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 bg-[#fbfdf8]">
                                <p className="text-[10px] font-black text-[#8a927e] uppercase tracking-widest order-2 sm:order-1">
                                    Page {currentPage} of {totalPages}
                                </p>

                                <div className="flex flex-wrap items-center justify-center gap-1.5 order-1 sm:order-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage <= 1 || isLoading}
                                        onClick={() => fetchTopups(1)}
                                        className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                                    >
                                        First
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage <= 1 || isLoading}
                                        onClick={() => fetchTopups(currentPage - 1)}
                                        className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                                    >
                                        Prev
                                    </Button>

                                    <div className="flex items-center gap-1 mx-1">
                                        {(() => {
                                            const pages = [];
                                            if (totalPages > 0) {
                                                pages.push(currentPage);
                                                if (currentPage < totalPages) {
                                                    pages.push(currentPage + 1);
                                                    if (currentPage + 1 < totalPages) {
                                                        pages.push("...");
                                                    }
                                                }
                                            }

                                            return pages.map((page, idx) => (
                                                <React.Fragment key={idx}>
                                                    {page === "..." ? (
                                                        <span className="w-8 h-8 flex items-center justify-center text-[#8a927e]">...</span>
                                                    ) : (
                                                        <Button
                                                            variant={currentPage === page ? "default" : "outline"}
                                                            size="icon"
                                                            disabled={isLoading}
                                                            onClick={() => fetchTopups(page as number)}
                                                            className={`h-8 w-8 text-[11px] font-bold transition-all ${currentPage === page
                                                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-primary"
                                                                    : "border-[#dce8d3] bg-white hover:bg-[#f3f7ef]"
                                                                }`}
                                                        >
                                                            {page}
                                                        </Button>
                                                    )}
                                                </React.Fragment>
                                            ));
                                        })()}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage >= totalPages || isLoading}
                                        onClick={() => fetchTopups(currentPage + 1)}
                                        className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                                    >
                                        Next
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={currentPage >= totalPages || isLoading}
                                        onClick={() => fetchTopups(totalPages)}
                                        className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                                    >
                                        Last
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
