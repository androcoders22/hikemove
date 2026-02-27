"use client";

import React, { useState } from "react";
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
import { toast } from "sonner";
import { format } from "date-fns";

interface DepositRow {
  srNo: number;
  date: string;
  remark: string;
  activity: string;
  txnHash: string;
  amount: string;
  screenshot: string;
  status: "Pending" | "Verified" | "Rejected";
}

export default function DepositActivity() {
  const [deposits, setDeposits] = useState<DepositRow[]>([
    {
      srNo: 1,
      date: "27/01/2026 14:30:22",
      remark: "Monthly Top-up",
      activity: "Add Fund",
      txnHash: "0x7a5421f...e829",
      amount: "500 USDT",
      screenshot: "receipt_01.jpg",
      status: "Verified",
    },
    {
      srNo: 2,
      date: "25/01/2026 10:15:45",
      remark: "Initial Deposit",
      activity: "Add Fund",
      txnHash: "0xd8a921b...f12a",
      amount: "1000 USDT",
      screenshot: "receipt_02.jpg",
      status: "Verified",
    },
  ]);

  const [isAddFundOpen, setIsAddFundOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    txnHash: "",
    screenshot: null as File | null,
  });

  const walletAddress = "OxD245B223250F9b7f7AF76cB189f5b19C11f336cb";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Wallet address copied!");
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.txnHash) {
      toast.error("Please fill in all required fields");
      return;
    }

    console.log("Adding new fund request:", formData);

    const newDeposit: DepositRow = {
      srNo: deposits.length + 1,
      date: format(new Date(), "dd/MM/yyyy HH:mm:ss"),
      remark: "New Fund Request",
      activity: "Add Fund",
      txnHash: formData.txnHash,
      amount: `${formData.amount} USDT`,
      screenshot: formData.screenshot ? formData.screenshot.name : "upload.jpg",
      status: "Pending",
    };

    setDeposits([newDeposit, ...deposits]);
    setIsAddFundOpen(false);
    setFormData({ amount: "", txnHash: "", screenshot: null });
    toast.success("Fund request submitted for verification!");
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
            <DialogContent className="sm:max-w-[450px] rounded-2xl border-border bg-background p-0 overflow-hidden">
              <DialogHeader className="p-6 bg-muted/30 border-b border-border">
                <DialogTitle className="text-xl font-black uppercase tracking-tight">
                  Add Fund
                </DialogTitle>
                <DialogDescription className="text-xs font-bold text-muted-foreground uppercase opacity-70">
                  Transfer USDT (BEP 20) to the address below
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 space-y-6">
                {/* QR Code & Wallet Area */}
                <div className="flex flex-col items-center gap-4 bg-muted/10 p-4 rounded-xl border border-dashed border-border">
                  <div className="w-40 h-40 bg-white p-2 rounded-lg shadow-inner border border-border">
                    <img
                      src="/qr.png"
                      alt="QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Wallet Address (USDT BEP-20)
                    </Label>
                    <div className="flex items-center gap-2 bg-background border border-border px-3 py-2 rounded-lg">
                      <code className="text-[11px] font-mono font-bold text-primary truncate flex-1">
                        {walletAddress}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={() => handleCopy(walletAddress)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="amount"
                      className="text-[10px] font-black uppercase tracking-widest"
                    >
                      Enter Amount (In USDT BEP 20)
                    </Label>
                    <Input
                      id="amount"
                      placeholder="0.00"
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="h-10 font-bold border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="txnHash"
                      className="text-[10px] font-black uppercase tracking-widest"
                    >
                      Transaction Hash
                    </Label>
                    <Input
                      id="txnHash"
                      placeholder="6777997a5421f...."
                      value={formData.txnHash}
                      onChange={(e) =>
                        setFormData({ ...formData, txnHash: e.target.value })
                      }
                      className="h-10 font-mono text-xs border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest">
                      Transaction Screenshot
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
                            : "Click to upload screenshot"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    Verify & Submit
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
                {deposits.map((row) => (
                  <TableRow
                    key={row.srNo}
                    className="border-border hover:bg-muted/20 transition-colors group"
                  >
                    <TableCell className="text-xs font-bold text-muted-foreground">
                      {row.srNo}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      <div className="flex flex-col">
                        <span>{row.date.split(" ")[0]}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {row.date.split(" ")[1]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-500 italic">
                      "{row.remark}"
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-black uppercase tracking-tight bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {row.activity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                        <span className="truncate max-w-[80px]">
                          {row.txnHash}
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
                      {row.amount}
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
                          row.status === "Verified"
                            ? "bg-emerald-50 text-emerald-600"
                            : row.status === "Pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {row.status === "Verified" && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {row.status === "Pending" && (
                          <Clock className="h-3 w-3 animate-pulse" />
                        )}
                        {row.status === "Rejected" && (
                          <XCircle className="h-3 w-3" />
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
