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
        status: ""
    });

    const [contactData, setContactData] = useState<ContactRow[]>([]);

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col  bg-background/50">
            <PageHeader
                title="Contact List"
                breadcrumbs={[
                    { title: "Settings", href: "#" },
                    { title: "Contact List" },
                ]}
            />

            <div className="flex-0 px-6 w-full space-y-6">
                <Card className="border-border py-0 shadow-sm overflow-hidden bg-white dark:bg-card">
                    <CardHeader className="p-6 border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Mail className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground">
                                Contact List
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-8">
                        {/* Filter Inputs Row - Matching image with 5 inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                            {(Object.keys(filters) as Array<keyof typeof filters>).map((key) => (
                                <div key={key} className="relative group">
                                    <Input
                                        placeholder="Enter Text"
                                        value={filters[key]}
                                        onChange={(e) => handleFilterChange(key, e.target.value)}
                                        className="h-10 px-3 text-[11px] border-border bg-background/50 focus:bg-white dark:focus:bg-card placeholder:text-muted-foreground/50 rounded-lg transition-all"
                                    />
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                                </div>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="border border-border rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                            <div className="min-w-[800px]">
                                <Table>
                                    <TableHeader className="bg-muted/50 border-b border-border">
                                        <TableRow>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary">Sr. No.</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary">Name</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary">Mobile</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary">Message</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary">Date</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contactData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="p-12 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <MessageSquare className="h-8 w-8 text-muted-foreground/30" />
                                                        <p className="text-sm font-bold">No contacts found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            contactData.map((row) => (
                                                <TableRow key={row.srNo} className="hover:bg-muted/20 transition-colors border-b last:border-0">
                                                    <TableCell className="text-xs font-bold text-muted-foreground py-4 px-4">{row.srNo}</TableCell>
                                                    <TableCell className="text-xs font-bold text-foreground py-4 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-3 w-3 text-primary" />
                                                            {row.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-xs py-4 px-4 text-muted-foreground font-mono">
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3 w-3 text-sky-500" />
                                                            {row.mobile}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-xs py-4 px-4 text-muted-foreground italic max-w-xs truncate">
                                                        "{row.message}"
                                                    </TableCell>
                                                    <TableCell className="text-[10px] py-4 px-4 font-mono font-bold text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-3 w-3 text-amber-500" />
                                                            {row.date}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 px-4">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${row.status === "New"
                                                            ? "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800"
                                                            : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                                                            }`}>
                                                            {row.status}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
