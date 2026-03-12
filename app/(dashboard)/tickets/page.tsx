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
  Loader2,
  XCircle,
  Eye
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
import toast from "react-hot-toast";
import { format } from "date-fns";
import { getTicketsAPI, createTicketAPI } from "@/lib/api/ticket";
import { uploadImageAPI } from "@/lib/api/aws";
import { api, BASE_URL } from "@/lib/axios";

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

  // Preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const buildScreenshotUrl = (key: string | undefined) => {
    if (!key) return null;
    return `${BASE_URL}/aws/${encodeURIComponent(key)}`;
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

      let screenshotKey = "";
      if (screenshot) {
        try {
          const uploadRes = await uploadImageAPI(screenshot);
          if (uploadRes.status && uploadRes.data) {
            screenshotKey = uploadRes.data;
          } else {
            toast.error("Failed to upload screenshot");
            setIsSubmitting(false);
            return;
          }
        } catch (uploadError) {
          toast.error("Error uploading screenshot");
          console.error(uploadError);
          setIsSubmitting(false);
          return;
        }
      }

      // Constructing JSON data based on your payload structure
      const payload = {
        problemType: formData.problemType,
        description: formData.description,
        subject: formData.subject,
        status: "open",
        screenshot: screenshotKey,
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
                    Screenshot
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
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Loading tickets...
                    </TableCell>
                  </TableRow>
                ) : tickets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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
                            {getTicketTypeLabel(row.problemType)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground max-w-[300px] truncate">
                        {row.description}
                      </TableCell>
                      <TableCell className="text-center">
                        {row.screenshot ? (
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-lg border-border"
                            type="button"
                            onClick={() => {
                              const key = row.screenshot;
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
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        ) : (
                          <span className="text-xs font-semibold text-muted-foreground">
                            NA
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-muted-foreground">
                        {format(new Date(row.createdAt), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm ${row.status.toLowerCase() === "resolved" ||
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

        {/* Improved Image Preview Modal */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-3xl bg-transparent border-none p-0 shadow-none focus:outline-none focus:ring-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Screenshot Preview</DialogTitle>
              <DialogDescription>Viewing uploaded ticket attachment</DialogDescription>
            </DialogHeader>
            <div className="relative flex flex-col items-center justify-center p-4">
              {/* {isPreviewLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl">
                  <div className="flex flex-col items-center gap-3 bg-background p-6 rounded-2xl shadow-xl border border-border">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-bold text-muted-foreground animate-pulse">
                      Loading secure image...
                    </p>
                  </div>
                </div>
              )} */}

              {!previewError && previewUrl && (
                <img
                  src={previewUrl}
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
                <div className="flex flex-col items-center justify-center min-h-[350px] gap-4 p-8 bg-background rounded-xl border border-border shadow-2xl">
                  <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <div className="text-center max-w-sm space-y-2">
                    <p className="text-lg font-black text-foreground">
                      Failed to Load Image
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">
                      The image might have been removed, or you might not have permission to view it.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-4 font-bold border-border bg-background hover:bg-muted"
                    onClick={() => window.open(previewUrl, '_blank')}
                  >
                    Open Raw Link 
                  </Button>
                </div>
              )} */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
