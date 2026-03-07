"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Users, Search, CheckCircle2, Clock, List } from "lucide-react";
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
import { Label } from "@/components/ui/label";
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
        status: ""
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
            // Placeholder for API call: const res = await getDownlineAPI(downlineId, selectType);
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
        <div className="flex flex-col min-h-screen bg-background/50">
            <PageHeader
                title="Member Downline"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "Member Downline" },
                ]}
            />

            <div className="flex-0 p-6 w-full space-y-6 pt-0 ">
                <Card className="border-border shadow-sm overflow-hidden bg-white dark:bg-card pt-0">
                    <CardHeader className="p-6 border-b bg-muted/30 mt-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Users className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground">
                                Downline
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-8 text-foreground">
                        <form
                            onSubmit={handleFetchDownline}
                            className="flex flex-col md:flex-row items-center gap-6 bg-muted/5 p-6 rounded-xl border border-border/50"
                        >
                            <div className="text-[11px] font-black uppercase tracking-widest text-foreground/70 whitespace-nowrap">
                                Your Downline Id
                            </div>

                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                <Select value={selectType} onValueChange={setSelectType}>
                                    <SelectTrigger className="h-11 bg-background border-border rounded-lg">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="direct">Direct Downline</SelectItem>
                                        <SelectItem value="all">All Downline</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="relative group">
                                    <Input
                                        placeholder="Enter Downline Id"
                                        value={downlineId}
                                        onChange={(e) => setDownlineId(e.target.value)}
                                        className="h-11 pl-10 bg-background border-border focus:ring-2 focus:ring-primary/20 transition-all rounded-lg"
                                    />
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-11 px-10 bg-primary hover:bg-primary/80 text-white font-black uppercase tracking-widest text-[11px] rounded-lg shadow-sm transition-all shrink-0"
                            >
                                {isLoading ? "Searching..." : "Submit"}
                            </Button>
                        </form>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 px-1">
                            {Object.keys(filters).map((key) => (
                                <div key={key} className="relative group">
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
                                        className="h-10 px-3 text-[11px] border-border bg-background/50 focus:bg-white placeholder:text-muted-foreground/40 rounded-lg transition-all"
                                    />
                                </div>
                            ))}
                        </div>

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
                                        {downlineData.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="p-12 text-center text-muted-foreground">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <List className="h-8 w-8 text-muted-foreground/30" />
                                                        <p className="text-sm font-bold">No downline members found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            downlineData.map((row) => (
                                                <TableRow
                                                    key={row.srNo}
                                                    className="hover:bg-muted/20 transition-colors border-b last:border-0 font-medium"
                                                >
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
                                                        <span
                                                            className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                                                row.status === "Active"
                                                                    ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                                                                    : "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
                                                            }`}
                                                        >
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