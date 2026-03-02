"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Plus,
  Wallet,
  Copy,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  QrCode,
  Image as ImageIcon,
  Upload,
  ExternalLink,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getFundRequestsMeAPI,
  createFundRequestAPI,
} from "@/lib/api/fund-request";

const fundRequestSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  transactionHash: z.string().min(1, "Transaction hash is required"),
  screenshot: z.any().optional(),
});

type FundRequestFormValues = z.infer<typeof fundRequestSchema>;

interface DepositRow {
  _id: string;
  createdAt: string;
  remark?: string;
  activity?: string;
  transactionHash: string;
  amount: number;
  screenshot?: string;
  status: string;
}

export default function DepositActivity() {
  const [deposits, setDeposits] = useState<DepositRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddFundOpen, setIsAddFundOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FundRequestFormValues>({
    resolver: zodResolver(fundRequestSchema),
    defaultValues: {
      amount: "",
      transactionHash: "",
      screenshot: null,
    },
  });

  const watchScreenshot = watch("screenshot");

  const fetchDeposits = async () => {
    try {
      setIsLoading(true);
      const response = await getFundRequestsMeAPI();
      if (response.data.status && response.data.data) {
        setDeposits(response.data.data);
      } else if (response.data) {
        setDeposits(response.data);
      }
    } catch (error) {
      toast.error("Failed to load deposit history");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const walletAddress = "OxD245B223250F9b7f7AF76cB189f5b19C11f336cb";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Wallet address copied!");
  };

  const onSubmit = async (data: FundRequestFormValues) => {
    try {
      setIsSubmitting(true);
      const payload = {
        amount: Number(data.amount),
        transactionHash: data.transactionHash,
        screenshot: data.screenshot ? data.screenshot.name : "",
        status: "pending",
      };

      await createFundRequestAPI(payload);

      toast.success("Fund request submitted for verification!");
      setIsAddFundOpen(false);
      reset();
      fetchDeposits();
    } catch (error) {
      toast.error("Failed to submit fund request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Deposit Activity"
        breadcrumbs={[
          { title: "App", href: "#" },
          { title: "Deposit Activity" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
              Transaction History
            </h2>
            <p className="text-xs text-muted-foreground">
              Manage your fund requests and deposit history
            </p>
          </div>

          <Dialog open={isAddFundOpen} onOpenChange={setIsAddFundOpen}>
            <DialogTrigger asChild>
              <Button className="font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" />
                ADD FUND
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-2xl border-[#dcf0c5] bg-[#fdfefc] p-0 overflow-hidden shadow-xl">
              <DialogHeader className="p-4 px-5 bg-[#f4faef] border-b border-[#dcf0c5]">
                <DialogTitle className="text-lg font-black uppercase tracking-tight text-[#42523d]">
                  ADD FUND
                </DialogTitle>
                <DialogDescription className="text-[9px] font-bold text-[#8ba27d] uppercase tracking-wider opacity-100">
                  Transfer USDT (BEP 20) to the address below
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 space-y-6">
                {/* QR Code & Wallet Area */}
                <div className="flex flex-col items-center gap-4 bg-transparent p-5 rounded-xl border border-dashed border-[#c5e1a5]">
                  <div className="w-36 h-36">
                    <img
                      src="/qr.png"
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="w-full space-y-2 mt-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#56684f]">
                      Wallet Address (USDT BEP-20)
                    </Label>
                    <div className="flex items-center gap-2 bg-[#f4faef] border border-[#dcf0c5] px-3 py-2.5 rounded-lg justify-between">
                      <code className="text-[11px] font-bold text-[#62b01a] truncate flex-1">
                        {walletAddress}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-[#8ba27d] hover:text-[#56684f] hover:bg-transparent"
                        onClick={() => handleCopy(walletAddress)}
                        type="button"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="amount"
                      className={`text-[10px] font-black uppercase tracking-widest ${errors.amount ? "text-red-500" : "text-[#56684f]"}`}
                    >
                      Enter Amount (In USDT BEP 20)
                    </Label>
                    <Input
                      id="amount"
                      placeholder="0.00"
                      type="number"
                      {...register("amount")}
                      className={`h-11 font-bold bg-white border-[#dcf0c5] text-[#42523d] focus-visible:ring-[#62b01a]/30 ${errors.amount ? "border-red-500" : ""}`}
                    />
                    {errors.amount && (
                      <p className="text-xs text-red-500">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="transactionHash"
                      className={`text-[10px] font-black uppercase tracking-widest ${errors.transactionHash ? "text-red-500" : "text-[#56684f]"}`}
                    >
                      Transaction Hash
                    </Label>
                    <Input
                      id="transactionHash"
                      placeholder="6777997a5421f...."
                      {...register("transactionHash")}
                      className={`h-11 font-mono text-sm bg-white border-[#dcf0c5] text-[#42523d] focus-visible:ring-[#62b01a]/30 ${errors.transactionHash ? "border-red-500" : ""}`}
                    />
                    {errors.transactionHash && (
                      <p className="text-xs text-red-500">
                        {errors.transactionHash.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-[#56684f]">
                      Transaction Screenshot
                    </Label>
                    <div className="border-2 border-dashed border-[#dcf0c5] bg-[#fafdf8] rounded-xl p-5 text-center cursor-pointer hover:bg-[#f4faef] transition-colors relative">
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={(e) =>
                          setValue("screenshot", e.target.files?.[0] || null)
                        }
                      />
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="h-6 w-6 text-[#62b01a]" />
                        <span className="text-[10px] font-black text-[#56684f] uppercase tracking-widest">
                          {watchScreenshot
                            ? watchScreenshot.name
                            : "Click to upload screenshot"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-sm font-black uppercase tracking-widest bg-[#62b01a] hover:bg-[#539714] text-white shadow-lg shadow-[#62b01a]/20 rounded-lg mt-2"
                  >
                    {isSubmitting ? "Submitting..." : "Verify & Submit"}
                  </Button>
                </form>
              </div>
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
                    Sr. No.
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Date
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Remark
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Activity
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Txn Hash
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Amount
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">
                    Screenshot
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
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : deposits.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No matching records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  deposits.map((row, index) => (
                    <TableRow
                      key={row._id || index}
                      className="border-border hover:bg-muted/20 transition-colors group"
                    >
                      <TableCell className="text-xs font-bold text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-foreground">
                        <div className="flex flex-col">
                          <span>
                            {row.createdAt
                              ? format(new Date(row.createdAt), "dd/MM/yyyy")
                              : "-"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {row.createdAt
                              ? format(new Date(row.createdAt), "HH:mm")
                              : "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-slate-500 italic">
                        "{row.remark || "Fund Request"}"
                      </TableCell>
                      <TableCell>
                        <span className="text-[10px] font-black uppercase tracking-tight bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {row.activity || "Add Fund"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                          <span className="truncate max-w-[80px]">
                            {row.transactionHash || "-"}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-black text-foreground">
                        {row.amount} USDT
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-lg border-border"
                        >
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm ${
                            row.status?.toLowerCase() === "approved" ||
                            row.status?.toLowerCase() === "verified"
                              ? "bg-emerald-50 text-emerald-600"
                              : row.status?.toLowerCase() === "pending"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {(row.status?.toLowerCase() === "approved" ||
                            row.status?.toLowerCase() === "verified") && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          {row.status?.toLowerCase() === "pending" && (
                            <Clock className="h-3 w-3 animate-pulse" />
                          )}
                          {(row.status?.toLowerCase() === "rejected" ||
                            row.status?.toLowerCase() === "declined") && (
                            <XCircle className="h-3 w-3" />
                          )}
                          {row.status || "Unknown"}
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
