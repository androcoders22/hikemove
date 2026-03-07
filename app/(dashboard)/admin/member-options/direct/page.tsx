"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Search, CheckCircle2, Clock, List, UserCheck } from "lucide-react";
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
import { toast } from "sonner";

interface DirectRow {
    srNo: number;
    memberId: string;
    memberName: string;
    memberPackage: string;
    joiningDate: string;
    activationDate: string;
    status: string;
}

export default function MyDirectPage() {
    const [memberIdSearch, setMemberIdSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        memberId: "",
        memberName: "",
        joiningDate: "",
        activationDate: "",
        status: ""
    });

    const [directData, setDirectData] = useState<DirectRow[]>([]);

    const handleFetchDirect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memberIdSearch) {
            toast.error("Please enter a Member Id");
            return;
        }
        setIsLoading(true);
        try {
            // Placeholder for API call: const res = await getDirectAPI(memberIdSearch);
            await new Promise(resolve => setTimeout(resolve, 800));
            setDirectData([]); // This will be set with actual API data
            toast.success("Direct member data retrieved");
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col min-h-screen bg-background/50">
            <PageHeader
                title="My Direct"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "My Direct" },
                ]}
            />

            <div className="flex-0 p-6 w-full space-y-6 pt-0">
                <Card className="border-border shadow-sm overflow-hidden bg-white dark:bg-card pt-0">
                    <CardHeader className="p-6 border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground">
                                My Direct
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-8 text-foreground">
                        {/* Top Input Row matching image */}
                        <form onSubmit={handleFetchDirect} className="flex flex-col md:flex-row items-center gap-6 bg-muted/5 p-4 rounded-xl border border-border/50">
                            <div className="relative group w-full max-w-sm">
                                <Input
                                    placeholder="Enter Member Id"
                                    value={memberIdSearch}
                                    onChange={(e) => setMemberIdSearch(e.target.value)}
                                    className="h-11 pl-10 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg"
                                />
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-11 px-4 bg-primary hover:bg-primary/80 text-white font-black uppercase tracking-widest text-[11px] rounded-lg shadow-sm transition-all shrink-0"
                            >
                                {isLoading ? "Searching..." : "Submit"}
                            </Button>
                        </form>

                        {/* Filter Row matching image */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 px-1">
                            {Object.keys(filters).map((key) => (
                                <div key={key} className="relative group">
                                    <Input
                                        placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                        value={filters[key as keyof typeof filters]}
                                        onChange={(e) => handleFilterChange(key as keyof typeof filters, e.target.value)}
                                        className="h-10 px-3 text-[11px] border-border bg-background/50 focus:bg-white placeholder:text-muted-foreground/40 rounded-lg transition-all"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="border border-border rounded-xl overflow-hidden shadow-sm overflow-x-auto">
                            <div className="min-w-[1000px]">
                                <Table>
                                    <TableHeader className="bg-muted/50 border-b border-border">
                                        <TableRow>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary">Sr. No.</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary">Member Id</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary">Member Name</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary">Member Package</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary">Joining Date</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary">Activation Date</TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-primary text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {directData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="p-12 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <List className="h-8 w-8 text-muted-foreground/30" />
                                                        <p className="text-sm font-bold">No direct members found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            directData.map((row) => (
                                                <TableRow key={row.srNo} className="hover:bg-muted/20 transition-colors border-b last:border-0 font-medium">
                                                    <TableCell className="text-xs font-bold text-muted-foreground py-4 px-4">{row.srNo}</TableCell>
                                                    <TableCell className="text-xs font-bold text-primary py-4 px-4">{row.memberId}</TableCell>
                                                    <TableCell className="text-xs py-4 px-4 text-foreground">{row.memberName}</TableCell>
                                                    <TableCell className="text-xs py-4 px-4 text-foreground">
                                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                                                            {row.memberPackage}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-[10px] py-4 px-4 text-muted-foreground font-mono">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-3 w-3" />
                                                            {row.joiningDate}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-[10px] py-4 px-4 text-muted-foreground font-mono">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                            {row.activationDate}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 px-4 text-right">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${row.status === "Active"
                                                            ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                                                            : "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
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
