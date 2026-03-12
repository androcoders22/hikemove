"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
    PiggyBank,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    Loader2,
    UserCircle2,
    ImageIcon
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { getAllFundRequestsAPI, approveFundRequestAPI, rejectFundRequestAPI } from "@/lib/api/fund-request";
import toast from "react-hot-toast";

interface FundRequest {
    _id: string;
    memberId: string;
    amount: number;
    status: string;
    screenshot?: string;
    createdAt: string;
    user?: {
        memberId: string;
        memberName: string;
    };
}

export default function FundRequestManagementPage() {
    const [fundRequests, setFundRequests] = useState<FundRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<FundRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);
    const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
    const [submittingId, setSubmittingId] = useState<string | null>(null);

    const fetchFundRequests = async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const response = await getAllFundRequestsAPI();
            const data = response.data?.data || response.data || [];
            setFundRequests(data);
            applyFilter(data, filterStatus);
        } catch (error) {
            console.error("Error fetching fund requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFundRequests();
    }, []);

    const applyFilter = (data: FundRequest[], status: string) => {
        if (status === "all") {
            setFilteredRequests(data);
        } else {
            setFilteredRequests(data.filter(req => req.status?.toLowerCase() === status.toLowerCase()));
        }
    };

    const handleFilterChange = (value: string) => {
        setFilterStatus(value);
        applyFilter(fundRequests, value);
    };

    const handleApprove = async (id: string) => {
        setSubmittingId(id);
        try {
            const res = await approveFundRequestAPI(id);
            if (res.data?.status === true || res.status === 200) {
                toast.success("Fund request approved successfully");
                fetchFundRequests(true);
            }
        } catch (error) {
            console.error("Error approving fund request:", error);
        } finally {
            setSubmittingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setSubmittingId(id);
        try {
            const res = await rejectFundRequestAPI(id);
            if (res.data?.status === true || res.status === 200) {
                toast.success("Fund request rejected successfully");
                fetchFundRequests(true);
            }
        } catch (error) {
            console.error("Error rejecting fund request:", error);
        } finally {
            setSubmittingId(null);
        }
    };

    const handleViewScreenshot = (url: string) => {
        setSelectedScreenshot(url);
        setIsScreenshotModalOpen(true);
    };

    const getStatusBadge = (status: string) => {
        const s = status?.toLowerCase();
        switch (s) {
            case "approved":
                return (
                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 uppercase text-[9px] rounded-full">
                        Approved
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge className="border-rose-200 bg-rose-50 text-rose-700 font-bold px-2.5 py-0.5 uppercase text-[9px] rounded-full">
                        Rejected
                    </Badge>
                );
            case "pending":
                return (
                    <Badge className="border-amber-200 bg-amber-50 text-amber-700 font-bold px-2.5 py-0.5 uppercase text-[9px] rounded-full">
                        Pending
                    </Badge>
                );
            default:
                return (
                    <Badge className="border-gray-200 bg-gray-50 text-gray-600 font-bold px-2.5 py-0.5 uppercase text-[9px] rounded-full">
                        {status || "Unknown"}
                    </Badge>
                );
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Fund Requests"
                breadcrumbs={[
                    { title: "Payments", href: "#" },
                    { title: "Fund Requests" },
                ]}
            />

            <div className="w-full flex-1 p-2 pt-0 sm:p-4 sm:pt-0">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between px-1">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-[#dce8d3] text-primary shadow-sm">
                            <PiggyBank className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-[#4d553d]">
                                Fund Requests
                            </h2>
                            <p className="text-xs font-medium text-[#7a8270]">
                                Manage user deposit requests.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 rounded-lg border border-[#dce8d3] bg-white px-3 py-1 shadow-sm">
                            <Filter className="h-3.5 w-3.5 text-[#8a927e]" />
                            <span className="text-[11px] font-bold uppercase tracking-tight text-[#5c634f]">Filter Status:</span>
                            <Select value={filterStatus} onValueChange={handleFilterChange}>
                                <SelectTrigger className="h-7 w-[110px] border-none bg-transparent p-0 text-xs font-bold focus:ring-0 shadow-none">
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => fetchFundRequests(false)}
                            className="h-9 border-[#dce8d3] bg-white text-xs font-bold uppercase transition-all hover:bg-[#f3f7ef] shadow-sm rounded-lg"
                        >
                            Refresh
                        </Button>
                    </div>
                </div>

                <Card className="overflow-hidden rounded-xl border border-[#dce8d3] bg-white shadow-md py-0 gap-0">
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex min-h-[400px] items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative h-12 w-12">
                                        <div className="absolute h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                                    </div>
                                    <p className="text-sm font-bold text-[#7a8270] animate-pulse">Loading requests...</p>
                                </div>
                            </div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-6">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 ring-1 ring-[#dce8d3]">
                                    <Search className="h-10 w-10 text-[#a1a895]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#4d553d]">No requests found</h3>
                                <p className="mt-2 text-sm text-[#7a8270] max-w-sm">
                                    {filterStatus !== "all"
                                        ? `No ${filterStatus} fund requests match your filter.`
                                        : "There are currently no fund deposit requests in the system."}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Mobile View (Cards) */}
                                <div className="block space-y-3 p-3 lg:hidden">
                                    {filteredRequests.map((req) => (
                                        <div key={req._id} className="rounded-xl border border-[#dce8d3] bg-[#fafcf8] p-4 shadow-sm">
                                            <div className="mb-3 flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-[#dce8d3]">
                                                        <UserCircle2 className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-[#4d553d]">{req.memberId || req.user?.memberId}</p>
                                                        <p className="text-[10px] text-[#7a8270]">{new Date(req.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                {getStatusBadge(req.status)}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#e7efdf] mb-3">
                                                <div className="rounded-lg bg-white p-2">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#8a927e]">Amount</p>
                                                    <p className="text-sm font-black text-emerald-600">₹{req.amount.toLocaleString()}</p>
                                                </div>
                                                <div className="rounded-lg bg-white p-2 flex flex-col items-center justify-center">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#8a927e] mb-1">Receipt</p>
                                                    {req.screenshot ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-6 px-2 text-[10px] font-bold border-primary/20 text-primary hover:bg-primary/5"
                                                            onClick={() => handleViewScreenshot(req.screenshot!)}
                                                        >
                                                            View
                                                        </Button>
                                                    ) : (
                                                        <span className="text-[10px] text-[#a1a895]">-</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    className="flex-1 h-9 rounded-lg bg-emerald-600 text-[10px] font-bold uppercase text-white hover:bg-emerald-700 disabled:opacity-50"
                                                    disabled={req.status?.toLowerCase() !== 'pending' || submittingId === req._id}
                                                    onClick={() => handleApprove(req._id)}
                                                >
                                                    {submittingId === req._id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Approve"}
                                                </Button>
                                                <Button
                                                    className="flex-1 h-9 rounded-lg bg-rose-600 text-[10px] font-bold uppercase text-white hover:bg-rose-700 disabled:opacity-50"
                                                    disabled={req.status?.toLowerCase() !== 'pending' || submittingId === req._id}
                                                    onClick={() => handleReject(req._id)}
                                                >
                                                    {submittingId === req._id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Reject"}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop View (Table) */}
                                <div className="hidden overflow-x-auto lg:block">
                                    <Table>
                                        <TableHeader className="bg-[#f7fbf3]">
                                            <TableRow className="border-b border-[#dce8d3]">
                                                <TableHead className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Member</TableHead>
                                                <TableHead className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Amount</TableHead>
                                                <TableHead className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Screenshot</TableHead>
                                                <TableHead className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Status</TableHead>
                                                <TableHead className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredRequests.map((req) => (
                                                <TableRow key={req._id} className="border-b border-[#edf3e7] transition-all hover:bg-[#fbfdf8]">
                                                    <TableCell className="px-4 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-primary/10">
                                                                <UserCircle2 className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-[#4d553d]">{req.memberId || req.user?.memberId}</div>
                                                                <div className="text-[9px] font-medium text-[#8a927e] flex items-center gap-1">
                                                                    <Clock className="h-2 w-2" />
                                                                    {new Date(req.createdAt).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2 text-xs font-black text-emerald-600">
                                                        ₹{req.amount.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        {req.screenshot ? (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 px-2 text-[10px] font-bold text-primary hover:bg-primary/5 border border-primary/10 rounded-md gap-1"
                                                                onClick={() => handleViewScreenshot(req.screenshot!)}
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                                View
                                                            </Button>
                                                        ) : (
                                                            <span className="text-[10px] text-[#a1a895] font-medium italic">No proof</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        {getStatusBadge(req.status)}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Button
                                                                size="sm"
                                                                className="h-7 rounded-md bg-emerald-600 px-3 text-[9px] font-bold uppercase text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-40"
                                                                disabled={req.status?.toLowerCase() !== 'pending' || submittingId === req._id}
                                                                onClick={() => handleApprove(req._id)}
                                                            >
                                                                {submittingId === req._id ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : "Approve"}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="h-7 rounded-md bg-rose-600 px-3 text-[9px] font-bold uppercase text-white shadow-sm transition-all hover:bg-rose-700 disabled:opacity-40"
                                                                disabled={req.status?.toLowerCase() !== 'pending' || submittingId === req._id}
                                                                onClick={() => handleReject(req._id)}
                                                            >
                                                                {submittingId === req._id ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : "Reject"}
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Screenshot Modal */}
            <Dialog open={isScreenshotModalOpen} onOpenChange={setIsScreenshotModalOpen}>
                <DialogContent className="max-w-2xl rounded-2xl border-[#dce8d3] p-0 overflow-hidden shadow-2xl">
                    <DialogHeader className="p-5 border-b border-[#edf3e7] bg-[#fafcf8]">
                        <DialogTitle className="text-lg font-bold text-[#4d553d] flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-primary" />
                            Payment Screenshot
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 bg-white flex items-center justify-center min-h-[300px]">
                        {selectedScreenshot ? (
                            <img
                                src={selectedScreenshot}
                                alt="Payment Proof"
                                className="max-h-[70vh] w-auto rounded-lg shadow-lg border border-[#dce8d3] object-contain"
                            />
                        ) : (
                            <div className="text-center p-10">
                                <XCircle className="h-10 w-10 text-rose-500 mx-auto mb-3 opacity-20" />
                                <p className="text-sm font-medium text-[#7a8270]">Image could not be loaded</p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-4 bg-[#f7fbf3] border-t border-[#dce8d3]">
                        <Button
                            className="w-full sm:w-auto min-w-[120px] rounded-xl bg-[#4d553d] text-xs font-bold uppercase text-white hover:bg-[#3a412e]"
                            onClick={() => setIsScreenshotModalOpen(false)}
                        >
                            Close Preview
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
