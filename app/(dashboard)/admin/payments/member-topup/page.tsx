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

    const fetchTopups = async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const res = await getAllMemberTopupsAPI();
            const data = res.data?.data || res.data || [];
            setTopups(data);
        } catch (error) {
            console.error("Failed to fetch topups", error);
            toast.error("Failed to load topup history");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTopups();
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
                            onClick={() => fetchTopups(false)}
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
                                            <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Source (From)</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Receiver (To)</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Amount</TableHead>
                                            <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Date & Time</TableHead>
                                            <TableHead className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.map((row) => (
                                            <TableRow key={row._id} className="border-b border-[#edf3e7] transition-all hover:bg-[#fbfdf8]">
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
