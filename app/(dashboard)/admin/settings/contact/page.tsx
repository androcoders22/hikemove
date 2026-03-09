"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Search, Mail, Phone, MessageSquare, User, Clock } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactRow {
    srNo: number;
    name: string;
    mobile: string;
    message: string;
    date: string;
    status: string;
}

export default function ContactListPage() {
    const [filters, setFilters] = useState({
        name: "",
        mobile: "",
        message: "",
        date: "",
        status: "",
    });

    const [contactData, setContactData] = useState<ContactRow[]>([]);

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Contact List"
                breadcrumbs={[
                    { title: "Settings", href: "#" },
                    { title: "Contact List" },
                ]}
            />

            <div className="w-full min-w-0 flex-1 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
                <Card className="min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
                    <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                                <Mail className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                                <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                                    Contact List
                                </CardTitle>
                                <p className="mt-0.5 text-[11px] font-medium text-[#7a8270] sm:text-xs">
                                    Review and search submitted contact messages.
                                </p>
                            </div>
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
                                {(Object.keys(filters) as Array<keyof typeof filters>).map((key) => (
                                    <div key={key} className="relative group min-w-0">
                                        <Input
                                            placeholder={key
                                                .replace(/([A-Z])/g, " $1")
                                                .replace(/^./, (str) => str.toUpperCase())}
                                            value={filters[key]}
                                            onChange={(e) => handleFilterChange(key, e.target.value)}
                                            className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-3 pr-8 text-[11px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                                        />
                                        <Search className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#a1a895] transition-colors group-focus-within:text-primary" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {contactData.length === 0 ? (
                            <div className="rounded-lg border border-[#dce8d3] shadow-sm">
                                <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center sm:min-h-[240px]">
                                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 ring-1 ring-[#dce8d3]">
                                        <MessageSquare className="h-6 w-6 text-[#a1a895]" />
                                    </div>
                                    <p className="text-base font-bold tracking-tight text-[#4d553d] sm:text-lg">
                                        No contacts found
                                    </p>
                                    <p className="mt-1 max-w-md text-xs text-[#7a8270] sm:text-sm">
                                        Contact submissions will appear here once available.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Mobile + Tablet Card View */}
                                <div className="space-y-3 xl:hidden">
                                    {contactData.map((row) => (
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
                                                        <User className="h-4 w-4 shrink-0 text-primary" />
                                                        <span className="truncate">{row.name}</span>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] ${
                                                        row.status === "New"
                                                            ? "border-sky-200 bg-sky-50 text-sky-700"
                                                            : "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                    }`}
                                                >
                                                    {row.status}
                                                </span>
                                            </div>

                                            <div className="space-y-2 border-t border-[#e7efdf] pt-2">
                                                <div className="flex items-start gap-2 text-[11px] text-[#5f6851]">
                                                    <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
                                                    <span>{row.mobile}</span>
                                                </div>

                                                <div className="flex items-start gap-2 text-[11px] text-[#7b836f]">
                                                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                                                    <span>{row.date}</span>
                                                </div>

                                                <div className="rounded-md bg-white p-2">
                                                    <p className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#8a927e]">
                                                        Message
                                                    </p>
                                                    <p className="mt-1 text-xs italic text-[#6b7280] break-words">
                                                        "{row.message}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden overflow-x-auto rounded-lg border border-[#dce8d3] shadow-sm xl:block">
                                    <div className="min-w-[820px]">
                                        <Table>
                                            <TableHeader className="bg-[#f7fbf3]">
                                                <TableRow className="border-b border-[#dce8d3] hover:bg-transparent">
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Sr. No.
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Name
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Mobile
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Message
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Date
                                                    </TableHead>
                                                    <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">
                                                        Status
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {contactData.map((row) => (
                                                    <TableRow
                                                        key={row.srNo}
                                                        className="border-b border-[#edf3e7] transition-colors hover:bg-[#fbfdf8]"
                                                    >
                                                        <TableCell className="px-3 py-2.5 text-xs font-medium text-[#8a927e]">
                                                            {row.srNo}
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4d553d]">
                                                                <User className="h-3 w-3 text-primary" />
                                                                {row.name}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="flex items-center gap-1.5 text-xs font-mono text-[#5f6851]">
                                                                <Phone className="h-3 w-3 text-sky-500" />
                                                                {row.mobile}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="max-w-[240px] truncate text-xs italic text-[#6b7280]">
                                                                "{row.message}"
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#7b836f]">
                                                                <Clock className="h-3 w-3 text-amber-500" />
                                                                {row.date}
                                                            </div>
                                                        </TableCell>

                                                        <TableCell className="px-3 py-2.5">
                                                            <span
                                                                className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] ${
                                                                    row.status === "New"
                                                                        ? "border-sky-200 bg-sky-50 text-sky-700"
                                                                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
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