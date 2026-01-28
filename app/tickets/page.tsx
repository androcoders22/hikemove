"use client";

import React, { useState } from "react";
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

interface TicketRow {
  id: string;
  type: string;
  description: string;
  status: "Open" | "Resolved" | "Closed";
  date: string;
}

export default function TicketSystem() {
  const [tickets, setTickets] = useState<TicketRow[]>([
    {
      id: "TKT-1001",
      type: "Login Issue",
      description: "Unable to login using mobile app",
      status: "Resolved",
      date: "27/01/2026",
    },
    {
      id: "TKT-1042",
      type: "Withdrawal Delay",
      description: "Request #4521 still pending after 48h",
      status: "Open",
      date: "28/01/2026",
    },
  ]);

  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    screenshot: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.description) {
      toast.error("Please fill in required fields");
      return;
    }

    const newTicket: TicketRow = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      type: formData.type,
      description: formData.description,
      status: "Open",
      date: format(new Date(), "dd/MM/yyyy"),
    };

    setTickets([newTicket, ...tickets]);
    setIsNewTicketOpen(false);
    setFormData({ type: "", description: "", screenshot: null });
    toast.success("Support ticket created successfully!");
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
              <DialogHeader className="p-6 bg-muted/30 border-b border-border">
                <DialogTitle className="text-xl font-black uppercase tracking-tight">
                  New Support Ticket
                </DialogTitle>
                <DialogDescription className="text-xs font-bold text-muted-foreground uppercase opacity-70">
                  Select a category and describe your issue
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest">
                    Choose Problem Type
                  </Label>
                  <Select
                    onValueChange={(val) =>
                      setFormData({ ...formData, type: val })
                    }
                    value={formData.type}
                  >
                    <SelectTrigger className="h-11 font-bold">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Login Issue">Login Issue</SelectItem>
                      <SelectItem value="Withdrawal Issue">
                        Withdrawal Issue
                      </SelectItem>
                      <SelectItem value="Deposit Issue">
                        Deposit Issue
                      </SelectItem>
                      <SelectItem value="Top-up Issue">Top-up Issue</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
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
                        setFormData({
                          ...formData,
                          screenshot: e.target.files?.[0] || null,
                        })
                      }
                    />
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-[11px] font-bold text-muted-foreground uppercase">
                        {formData.screenshot
                          ? formData.screenshot.name
                          : "Upload screenshot"}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                  Submit Ticket
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
                    Problem Type
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
                {tickets.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border hover:bg-muted/20 transition-colors group"
                  >
                    <TableCell className="text-xs font-black text-primary">
                      {row.id}
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-black uppercase tracking-tight bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {row.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground max-w-[300px] truncate">
                      {row.description}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-muted-foreground">
                      {row.date}
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm ${
                          row.status === "Resolved"
                            ? "bg-emerald-50 text-emerald-600"
                            : row.status === "Open"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {row.status === "Resolved" && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {row.status === "Open" && (
                          <Clock className="h-3 w-3 animate-pulse" />
                        )}
                        {row.status === "Closed" && (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {row.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
