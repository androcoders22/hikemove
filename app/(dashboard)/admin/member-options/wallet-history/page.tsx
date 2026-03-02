"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Search, Filter, History, Wallet, CheckCircle2, Clock, XCircle } from "lucide-react";
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
import { checkMemberIdAPI } from "@/lib/api/member-topup";
import { Label } from "@/components/ui/label";

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

    // Filters state
    const [filters, setFilters] = useState({
        remark: "",
        date: "",
        type: "",
        total: "",
        adminCharge: "",
        tdsCharge: "",
        activity: "",
        status: ""
    });

    const handleFetchHistory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!walletId) {
            toast.error("Please enter a Wallet Id");
            return;
        }

        setIsLoading(true);
        try {
            // Check member and get balance
            const memberRes = await checkMemberIdAPI(walletId);
            if (memberRes.data?.status) {
                // Assuming the API returns balance or we fetch it from elsewhere
                // For now, let's just show the member found info if possible
                setCurrentBalance(0); // This should be updated if balance is available
            }

            // Fetch history - using dummy data as we don't have the specific admin history API yet
            // In a real scenario, we'd call an API like getWalletHistoryByMemberIdAPI(walletId)
            setHistoryData([
                {
                    srNo: 1,
                    remark: "Wallet Credit by Admin",
                    date: "2026-03-02 14:20:11",
                    type: "Credit",
                    total: 100.00,
                    adminCharge: 0.00,
                    tdsCharge: 0.00,
                    activity: "Manual Update",
                    netAmount: 100.00,
                    status: "Completed"
                },
                {
                    srNo: 2,
                    remark: "Service Fee Deduction",
                    date: "2026-03-01 10:15:45",
                    type: "Debit",
                    total: 10.00,
                    adminCharge: 0.00,
                    tdsCharge: 0.00,
                    activity: "System Charge",
                    netAmount: 10.00,
                    status: "Completed"
                }
            ]);

            toast.success("Wallet history retrieved successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch wallet history");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            <PageHeader
                title="Wallet History"
                breadcrumbs={[
                    { title: "Member Options", href: "#" },
                    { title: "Wallet History" },
                ]}
            />

            <div className="flex-0 p-6 w-full space-y-6">
                <Card className="border-border shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-6 border-b bg-gray-50/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <History className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-foreground">
                                Wallet History (Current Wallet: {currentBalance})
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-8">
                        {/* Search Input Row */}
                        <form onSubmit={handleFetchHistory} className="flex flex-col md:flex-row items-end gap-6">
                            <div className="space-y-2 w-full max-w-sm">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Your Wallet Id
                                </Label>
                                <Input
                                    placeholder="Enter Wallet Id"
                                    value={walletId}
                                    onChange={(e) => setWalletId(e.target.value)}
                                    className="h-11 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all rounded-lg"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-11 px-8 bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-widest text-[10px] rounded-lg shadow-sm transition-all"
                            >
                                {isLoading ? "Processing..." : "Submit"}
                            </Button>
                        </form>

                        {/* Filter Inputs Row */}
                        <div className="grid grid-cols-2 md:grid-cols-8 lg:grid-cols-8 gap-4">
                            {(Object.keys(filters) as Array<keyof typeof filters>).map((key) => (
                                <div key={key} className="space-y-1.5">
                                    <Input
                                        placeholder="Enter Text"
                                        value={filters[key]}
                                        onChange={(e) => handleFilterChange(key, e.target.value)}
                                        className="h-9 px-3 text-[10px] border-border bg-gray-50/50 focus:bg-white placeholder:text-gray-300 rounded-md"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-gray-50/80 border-b border-border">
                                    <TableRow>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">Sr. No.</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">Remark</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">Date</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">Type</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">Total</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">Admin Charge</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">TDS Charge</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">Activity</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4">Net Amount</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 px-4 text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {historyData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={10} className="p-12 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Search className="h-8 w-8 text-muted-foreground/30" />
                                                    <p className="text-sm font-bold">No history available</p>
                                                    <p className="text-xs">Enter a Wallet Id and submit to view transaction logs.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        historyData.map((row) => (
                                            <TableRow key={row.srNo} className="hover:bg-gray-50/50 transition-colors border-b last:border-0">
                                                <TableCell className="text-xs font-bold text-muted-foreground py-3 px-4">{row.srNo}</TableCell>
                                                <TableCell className="text-xs py-3 px-4 text-slate-500 italic">"{row.remark}"</TableCell>
                                                <TableCell className="text-[10px] py-3 px-4 font-mono font-bold">{row.date}</TableCell>
                                                <TableCell className="py-3 px-4">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${row.type === "Credit" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                                        }`}>
                                                        {row.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-xs font-black text-foreground py-3 px-4">${row.total.toFixed(2)}</TableCell>
                                                <TableCell className="text-xs py-3 px-4 text-rose-600">-${row.adminCharge.toFixed(2)}</TableCell>
                                                <TableCell className="text-xs py-3 px-4 text-rose-600">-${row.tdsCharge.toFixed(2)}</TableCell>
                                                <TableCell className="text-xs py-3 px-4 font-medium">{row.activity}</TableCell>
                                                <TableCell className="text-sm font-black text-primary py-3 px-4">${row.netAmount.toFixed(2)}</TableCell>
                                                <TableCell className="py-3 px-4 text-right">
                                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        {row.status}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

