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
    Loader2
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
import { Textarea } from "@/components/ui/textarea";
import { getTicketsAPI, createTicketAPI } from "@/lib/api/ticket";
import toast from "react-hot-toast";

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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsModalOpen(true);
    };

    const handleSubmitRemark = async () => {
        if (!selectedTicket || !supportRemark.trim()) return;

        setIsSubmitting(true);
        try {
            const payload = {
                // spreading original fields as per user request example
                problemType: selectedTicket.problemType,
                description: selectedTicket.description,
                subject: selectedTicket.subject,
                screenshot: selectedTicket.screenshot || "",
                // updating these two
                status: "closed",
                supportRemark: supportRemark
            };

            const res = await createTicketAPI(payload);

            if (res.status === 200 || res.status === 201 || res.data?.status === true) {
                toast.success("Support remark added successfully");
                setIsModalOpen(false);
                fetchTickets(true); // Refresh list
            }
        } catch (error) {
            console.error("Error submitting remark:", error);
        } finally {
            setIsSubmitting(false);
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
            case "closed":
                return (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 uppercase text-[10px] rounded-full">
                        Closed
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
                    { title: "Admin", href: "/admin/dashboard" },
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
                            <div className="flex min-h-[400px] items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative h-12 w-12">
                                        <div className="absolute h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                                    </div>
                                    <p className="text-sm font-bold text-[#7a8270] animate-pulse">Loading tickets...</p>
                                </div>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-6">
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
                                            <TableHead className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#5c634f] min-w-[200px]">Description</TableHead>
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
                                                        {ticket.problemType}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-4 py-1.5">
                                                    <p className="text-[11px] text-[#7a8270] line-clamp-1 max-w-[250px]">
                                                        {ticket.description}
                                                    </p>
                                                </TableCell>
                                                <TableCell className="px-4 py-1.5">
                                                    {getStatusBadge(ticket.status)}
                                                </TableCell>
                                                <TableCell className="px-4 py-1.5">
                                                    {ticket.screenshot ? (
                                                        <Button
                                                            variant="link"
                                                            className="h-auto p-0 text-primary font-bold text-[10px] flex items-center gap-1"
                                                            onClick={() => window.open(ticket.screenshot, '_blank')}
                                                        >
                                                            <Eye className="h-2.5 w-2.5" />
                                                            View
                                                        </Button>
                                                    ) : (
                                                        <span className="text-[10px] text-[#a1a895] font-medium">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4 py-1.5">
                                                    <div className="text-[10px] text-[#7a8270] italic truncate max-w-[100px]">
                                                        {ticket.supportRemark || "-"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-1.5 text-right">
                                                    {ticket.status?.toLowerCase() !== 'closed' && (
                                                        <Button
                                                            size="sm"
                                                            className="h-6.5 rounded-md bg-emerald-600 px-2.5 text-[9px] font-bold uppercase tracking-tight text-white transition-all hover:bg-emerald-700 shadow-sm"
                                                            onClick={() => handleApproveClick(ticket)}
                                                        >
                                                            Approve
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
                <DialogContent className="sm:max-w-[425px] rounded-2xl border-[#dce8d3] p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-xl font-bold text-[#4d553d] flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-emerald-600" />
                            Add Support Remark
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#7a8270] mt-1.5">
                            Provide a final remark to close this ticket.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#5c634f]">
                                Admin Remark
                            </label>
                            <div className="relative">
                                <Textarea
                                    placeholder="Enter your response here..."
                                    className="min-h-[120px] rounded-xl border-[#dce8d3] bg-[#fafcf8] focus:border-emerald-500/50 focus:ring-emerald-500/10 text-sm p-3 transition-all"
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
                                    Remark is required to approve
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
                                "Submit Response"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
