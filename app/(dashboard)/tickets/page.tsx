"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { getTicketsAPI, createTicketAPI } from "@/lib/api/ticket";

interface TicketRow {
  _id: string;
  problemType: string;
  subject: string;
  description: string;
  status: "open" | "resolved" | "closed" | string;
  screenshot?: string;
  createdAt: string;
}

export default function TicketSystem() {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [formData, setFormData] = useState({
    problemType: "",
    subject: "",
    description: "",
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await getTicketsAPI();
      if (response.data.status && response.data.data) {
        setTickets(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load tickets");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.problemType || !formData.subject || !formData.description) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      // Constructing JSON data based on your payload structure
      const payload = {
        problemType: formData.problemType,
        description: formData.description,
        subject: formData.subject,
        status: "open",
        screenshot: "", // Include actual screenshot logic here if/when image upload is supported by your backend
      };

      await createTicketAPI(payload);

      toast.success("Support ticket created successfully!");
      setIsNewTicketOpen(false);
      setFormData({ problemType: "", subject: "", description: "" });
      setScreenshot(null);
      fetchTickets(); // Refresh list after create
    } catch (error) {
      toast.error("Failed to submit ticket");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Ticket System"
        breadcrumbs={[
          { title: "App", href: "#" },
          { title: "Support Tickets" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
              Support Center
            </h2>
            <p className="text-xs text-muted-foreground">
              Track your queries and report technical issues
            </p>
          </div>

          <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
            <DialogTrigger asChild>
              <Button className="font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" />
                CREATE TICKET
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-2xl border-border bg-background p-0 overflow-hidden">
              <DialogHeader className="p-3 bg-muted/30 border-b border-border">
                <DialogTitle className="text-lg font-black uppercase tracking-tight">
                  New Support Ticket
                </DialogTitle>
                <DialogDescription className="text-xs font-bold text-muted-foreground uppercase opacity-70">
                  Select a category and describe your issue
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">
                    Choose Problem Type
                  </Label>
                  <Select
                    onValueChange={(val) =>
                      setFormData({ ...formData, problemType: val })
                    }
                    value={formData.problemType}
                  >
                    <SelectTrigger className="h-11 w-full font-bold">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="topup">Top-up</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="hashVerification">
                        Hash Verification
                      </SelectItem>
                      <SelectItem value="activation">Activation</SelectItem>
                      <SelectItem value="coin">Coin</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">
                    Subject
                  </Label>
                  <Input
                    placeholder="Brief subject of the issue"
                    className="h-11 font-medium text-sm border-border"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">
                    Describe Your Issues
                  </Label>
                  <Textarea
                    placeholder="Provide details about the problem..."
                    className="min-h-[100px] font-medium text-sm border-border resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">
                    Problem Screenshot (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors relative">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) =>
                        setScreenshot(e.target.files?.[0] || null)
                      }
                    />
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">
                        {screenshot ? screenshot.name : "Upload screenshot"}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table Area */}
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Ticket ID
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Subject / Problem Type
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Description
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Date
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Loading tickets...
                    </TableCell>
                  </TableRow>
                ) : tickets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No tickets found.
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((row) => (
                    <TableRow
                      key={row._id}
                      className="border-border hover:bg-muted/20 transition-colors group"
                    >
                      <TableCell className="text-xs font-black text-primary">
                        {row._id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-black truncate max-w-[200px]">
                            {row.subject}
                          </span>
                          <span className="w-fit text-[10px] font-black uppercase tracking-tight bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {row.problemType}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground max-w-[300px] truncate">
                        {row.description}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-muted-foreground">
                        {format(new Date(row.createdAt), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm ${
                            row.status.toLowerCase() === "resolved" ||
                            row.status.toLowerCase() === "closed"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {(row.status.toLowerCase() === "resolved" ||
                            row.status.toLowerCase() === "closed") && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          {row.status.toLowerCase() !== "resolved" &&
                            row.status.toLowerCase() !== "closed" && (
                              <Clock className="h-3 w-3 animate-pulse" />
                            )}
                          {row.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
