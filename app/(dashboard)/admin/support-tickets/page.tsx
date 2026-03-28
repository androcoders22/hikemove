"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
    Ticket as TicketIcon,
    Search,
    MessageSquare,
    CheckCircle2,
    Clock,
    AlertCircle,
    Eye,
    Plus,
    Loader2,
    ImageIcon,
    XCircle
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getTicketsAPI, TicketStatus, updateTicketAPI } from "@/lib/api/ticket";
import toast from "react-hot-toast";
import { api, BASE_URL } from "@/lib/axios";

interface Ticket {
    _id: string;
    subject: string;
    problemType: string;
    description: string;
    status: string;
    screenshot?: string;
    supportRemark: string;
    createdAt?: string;
}

export default function SupportTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [supportRemark, setSupportRemark] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(TicketStatus.IN_PROGRESS);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Preview state
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState(false);

    const buildScreenshotUrl = (key: string | undefined) => {
        if (!key) return null;
        return `${BASE_URL}/aws/${encodeURIComponent(key)}`;
    };

    const fetchTickets = async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const response = await getTicketsAPI();
            // Ensure response.data is an array and filter out nulls if any
            const data = Array.isArray(response.data) ? response.data :
                (response.data?.data && Array.isArray(response.data.data)) ? response.data.data : [];
            setTickets(data);
        } catch (error) {
            console.error("Error fetching tickets:", error);
            // toast.error is already handled by axios interceptor but just in case
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleApproveClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setSupportRemark(ticket.supportRemark || "");
        if (ticket.status === TicketStatus.OPEN || ticket.status === TicketStatus.IN_PROGRESS || ticket.status === TicketStatus.RESOLVED) {
            setSelectedStatus(ticket.status as TicketStatus);
        } else {
            setSelectedStatus(TicketStatus.IN_PROGRESS);
        }
        setIsModalOpen(true);
    };

    const handleSubmitRemark = async () => {
        if (!selectedTicket || !supportRemark.trim()) return;

        setIsSubmitting(true);
        try {
            const payload = {
                status: selectedStatus,
                supportRemark: supportRemark.trim(),
            };

            const res = await updateTicketAPI(selectedTicket._id, payload);

            if (res.status === 200 || res.status === 201 || res.data?.status === true) {
                toast.success("Support remark added successfully");
                setIsModalOpen(false);
                setSelectedTicket(null);
                fetchTickets(true); // Refresh list
            }
        } catch (error) {
            console.error("Error submitting remark:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTicketTypeLabel = (type: string) => {
        if (!type) return "-";
        switch (type) {
            case 'topup': return 'Topup';
            case 'transfer': return 'Transfer';
            case 'hashVerification': return 'Hash verification';
            case 'activation': return 'Activation';
            case 'coin': return 'Coin';
            case 'payment': return 'Payment';
            case 'withdrawal': return 'Withdrawal';
            case 'others': return 'Others';
            default: return type.charAt(0).toUpperCase() + type.slice(1);
        }
    };

    const getStatusBadge = (status: string) => {
        const lowerCaseStatus = status?.toLowerCase();
        switch (lowerCaseStatus) {
            case "open":
                return (
                    <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700 font-bold px-2 py-0.5 uppercase text-[10px] rounded-full">
                        Open
                    </Badge>
                );
            case "inprogress":
                return (
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 font-bold px-2 py-0.5 uppercase text-[10px] rounded-full">
                        In Progress
                    </Badge>
                );
            case "resolved":
            case "closed":
                return (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 uppercase text-[10px] rounded-full">
                        {lowerCaseStatus === "resolved" ? "Resolved" : "Closed"}
                    </Badge>
                );
            case "pending":
                return (
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600 font-bold px-2 py-0.5 uppercase text-[10px] rounded-full">
                        Pending
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-600 font-bold px-2 py-0.5 uppercase text-[10px] rounded-full">
                        {status || "Unknown"}
                    </Badge>
                );
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#f6f8f4]">
            <PageHeader
                title="Support Tickets"
                breadcrumbs={[
                    { title: "Admin", href: "/admin/tree-view" },
                    { title: "Support Tickets" },
                ]}
            />

            <div className="w-full flex-1 p-2 pt-0 sm:p-4 sm:pt-0">
                <div className="mb-4 flex items-center justify-between px-1">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-[#dce8d3] text-primary shadow-sm">
                            <TicketIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-[#4d553d]">
                                Support Tickets
                            </h2>
                            <p className="text-xs font-medium text-[#7a8270]">
                                Manage member support queries.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => fetchTickets(true)}
                        disabled={isRefreshing}
                        className="h-9 border-[#dce8d3] bg-white text-xs font-bold uppercase transition-all hover:bg-[#f3f7ef] shadow-sm rounded-lg"
                    >
                        {isRefreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : null}
                        Refresh
                    </Button>
                </div>

                <Card className="overflow-hidden rounded-xl border border-[#dce8d3] bg-white shadow-md py-0 gap-0">
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex min-h-100 items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative h-12 w-12">
                                        <div className="absolute h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                                    </div>
                                    <p className="text-sm font-bold text-[#7a8270] animate-pulse">Loading tickets...</p>
                                </div>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="flex min-h-100 flex-col items-center justify-center text-center p-6">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/5 ring-1 ring-[#dce8d3]">
                                    <Search className="h-10 w-10 text-[#a1a895]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#4d553d]">No tickets found</h3>
                                <p className="mt-2 text-sm text-[#7a8270] max-w-sm">
                                    There are currently no support tickets in the system.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-[#f7fbf3]">
                                        <TableRow className="border-b border-[#dce8d3]">
                                            <TableHead className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Subject</TableHead>
                                            <TableHead className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Type</TableHead>
                                            <TableHead className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#5c634f] min-w-50">Description</TableHead>
                                            <TableHead className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Status</TableHead>
                                            <TableHead className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Proof</TableHead>
                                            <TableHead className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Remark</TableHead>
                                            <TableHead className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tickets.map((ticket, index) => (
                                            <TableRow
                                                key={ticket._id || index}
                                                className="border-b border-[#edf3e7] transition-all hover:bg-[#fbfdf8]"
                                            >
                                                <TableCell className="px-4 py-1.5">
                                                    <div className="text-xs font-bold text-[#4d553d]">{ticket.subject}</div>
                                                </TableCell>
                                                <TableCell className="px-4 py-1.5">
                                                    <span className="text-[10px] font-semibold text-primary/80 bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                                                        {getTicketTypeLabel(ticket.problemType)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-1.5">
                                                    <p className="text-[11px] text-[#7a8270] line-clamp-1 max-w-62.5">
                                                        {ticket.description}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="px-4 py-1.5">
                                                    {getStatusBadge(ticket.status)}
                                                </TableCell>
                                                <TableCell className="px-4 py-1.5">
                                                    {ticket.screenshot ? (
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-8 w-8 rounded-lg border-[#dce8d3] bg-white transition-all hover:bg-[#f3f7ef]"
                                                            type="button"
                                                            onClick={() => {
                                                                const key = ticket.screenshot;
                                                                if (!key) return;

                                                                const directUrl = buildScreenshotUrl(key);
                                                                setPreviewUrl(directUrl);
                                                                setPreviewError(false);
                                                                setIsPreviewOpen(true);
                                                                setIsPreviewLoading(true);

                                                                api.get(`/aws/${encodeURIComponent(key)}`)
                                                                    .then((res) => {
                                                                        if (res.data?.status && res.data?.data) {
                                                                            setPreviewUrl(res.data.data);
                                                                            setPreviewError(false);
                                                                        } else {
                                                                            setPreviewError(true);
                                                                        }
                                                                        setIsPreviewLoading(false);
                                                                    })
                                                                    .catch((err) => {
                                                                        console.error("Failed to fetch S3 URL:", err);
                                                                        setPreviewError(true);
                                                                        setIsPreviewLoading(false);
                                                                    });
                                                            }}
                                                        >
                                                            <ImageIcon className="h-3.5 w-3.5 text-primary" />
                                                        </Button>
                                                    ) : (
                                                        <span className="text-[10px] text-[#a1a895] font-medium">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4 py-1.5">
                                                    <div className="text-[10px] text-[#7a8270] italic truncate max-w-25">
                                                        {ticket.supportRemark || "-"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-1.5 text-right">
                                                    {ticket.status?.toLowerCase() !== TicketStatus.RESOLVED.toLowerCase() && (
                                                        <Button
                                                            size="sm"
                                                            className="h-6.5 rounded-md bg-emerald-600 px-2.5 text-[9px] font-bold uppercase tracking-tight text-white transition-all hover:bg-emerald-700 shadow-sm"
                                                            onClick={() => handleApproveClick(ticket)}
                                                        >
                                                            Manage
                                                        </Button>
                                                    )}
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

            {/* Approve Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-106.25 rounded-2xl border-[#dce8d3] p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-xl font-bold text-[#4d553d] flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-emerald-600" />
                            Update Ticket
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#7a8270] mt-1.5">
                            Choose the ticket status and add an admin remark.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">
                                Ticket Status
                            </label>
                            <Select
                                value={selectedStatus}
                                onValueChange={(value) => setSelectedStatus(value as TicketStatus)}
                            >
                                <SelectTrigger className="h-10 rounded-xl border-[#dce8d3] bg-[#fafcf8] text-xs font-semibold">
                                    <SelectValue placeholder="Select ticket status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={TicketStatus.OPEN}>Open</SelectItem>
                                    <SelectItem value={TicketStatus.IN_PROGRESS}>In Progress</SelectItem>
                                    <SelectItem value={TicketStatus.RESOLVED}>Resolved</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">
                                Admin Remark
                            </label>
                            <div className="relative">
                                <Textarea
                                    placeholder="Enter your response here..."
                                    className="min-h-30 rounded-xl border-[#dce8d3] bg-[#fafcf8] focus:border-emerald-500/50 focus:ring-emerald-500/10 text-sm p-3 transition-all"
                                    value={supportRemark}
                                    onChange={(e) => setSupportRemark(e.target.value)}
                                    maxLength={500}
                                />
                                <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#a1a895]">
                                    {supportRemark.length}/500
                                </div>
                            </div>
                            {!supportRemark.trim() && (
                                <p className="text-[10px] text-destructive flex items-center gap-1.5 mt-1 font-medium">
                                    <AlertCircle className="h-3 w-3" />
                                    Remark is required to update this ticket
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="bg-[#f7fbf3] p-4 flex gap-3 border-t border-[#dce8d3]">
                        <Button
                            variant="outline"
                            className="flex-1 rounded-xl border-[#dce8d3] text-xs font-bold uppercase text-[#7a8270]"
                            onClick={() => setIsModalOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 rounded-xl bg-emerald-600 text-xs font-bold uppercase text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/10 transition-all active:scale-95"
                            onClick={handleSubmitRemark}
                            disabled={!supportRemark.trim() || isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Improved Image Preview Modal */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-3xl bg-transparent border-none p-0 shadow-none focus:outline-none focus:ring-0">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Screenshot Preview</DialogTitle>
                        <DialogDescription>Viewing uploaded ticket attachment</DialogDescription>
                    </DialogHeader>
                    <div className="relative flex flex-col items-center justify-center p-4">
                        {!previewError && previewUrl && (
                            <img
                                src={previewUrl || undefined}
                                alt="Screenshot preview"
                                className={`max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl transition-opacity duration-300 ${isPreviewLoading ? 'opacity-0' : 'opacity-100'}`}
                                onLoad={() => setIsPreviewLoading(false)}
                                onError={() => {
                                    setPreviewError(true);
                                    setIsPreviewLoading(false);
                                }}
                            />
                        )}
                        {/* {previewError && previewUrl && (
                <div className="flex flex-col items-center justify-center min-h-[350px] gap-4 p-8 bg-white rounded-xl border border-[#dce8d3] shadow-2xl">
                  <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
                    <XCircle className="h-8 w-8 text-rose-500" />
                  </div>
                  <div className="text-center max-w-sm space-y-2">
                    <p className="text-lg font-black text-[#4d553d]">
                      Failed to Load Image
                    </p>
                    <p className="text-sm font-medium text-[#7a8270]">
                      The image might have been removed, or you might not have permission to view it.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-4 font-bold border-[#dce8d3] bg-white text-[#4d553d] hover:bg-[#f3f7ef] rounded-lg h-10 px-6"
                    onClick={() => window.open(previewUrl || "", '_blank')}
                  >
                    Open Raw Link 
                  </Button>
                </div>
              )} */}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
