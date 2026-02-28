"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/page-header";
import {
  getWithdrawalHistoryAPI,
  createWithdrawalAPI,
} from "@/lib/api/withdrawal";
import { getWalletAPI } from "@/lib/api/wallet";
import {
  History,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WithdrawalData {
  _id: string;
  member: string;
  amount: number;
  walletAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function WithdrawalPage() {
  const [historyData, setHistoryData] = useState<WithdrawalData[]>([]);
  const [memberInfo, setMemberInfo] = useState({ id: "", balance: 0 });

  const withdrawalSchema = z.object({
    walletAddress: z
      .string()
      .min(10, { message: "Please enter a valid wallet address" }),
    amount: z
      .number()
      .min(1, { message: "Amount must be at least 1" })
      .max(memberInfo.balance || 0, {
        message: `Amount cannot exceed balance of ${memberInfo.balance}`,
      }),
  });

  type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      walletAddress: "",
      amount: 0,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await getWithdrawalHistoryAPI();
      if (res.data?.status && res.data?.data) {
        setHistoryData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await getWalletAPI();
      if (res.data?.status && res.data?.data) {
        setMemberInfo({
          id: res.data.data.member,
          balance: res.data.data.incomeBalance,
        });
      }
    } catch (error) {
      console.error("Failed to fetch wallet info", error);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchWallet();
  }, []);

  const onSubmit = async (values: WithdrawalFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        amount: values.amount,
        walletAddress: values.walletAddress,
      };
      const res = await createWithdrawalAPI(payload);
      if (res.data?.status) {
        toast.success("Withdrawal request submitted successfully!");
        form.reset();
        setIsDialogOpen(false);
        fetchHistory();
        fetchWallet(); // refresh balance
      }
    } catch (error: any) {
      const errMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Withdrawal"
        breadcrumbs={[
          { title: "Withdrawal Wallet", href: "#" },
          { title: "Withdrawals" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f8fcf5] border-[#d8e5d0]">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <History className="h-5 w-5 text-[#7db538]" />
              TRANSFER HISTORY :
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-xs font-bold bg-white text-muted-foreground hover:bg-muted/50 border-input"
              >
                <Search className="h-4 w-4 mr-2" />
                SEARCH
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-xs font-bold bg-white text-muted-foreground hover:bg-muted/50 border-input"
              >
                <Filter className="h-4 w-4 mr-2" />
                FILTER
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="h-9 px-4 text-xs font-bold shadow-sm bg-[#7db538] hover:bg-[#6a9e2d] text-white"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    NEW REQUEST
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Submit Request</DialogTitle>
                    <DialogDescription>
                      Withdraw your earnings to USDT (BEP 20)
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 pt-2"
                  >
                    {/* Read-only Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">
                          Member Id
                        </Label>
                        <p
                          className="font-semibold text-foreground truncate"
                          title={memberInfo.id}
                        >
                          {memberInfo.id || "Loading..."}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">
                          Balance
                        </Label>
                        <p className="font-semibold text-foreground">
                          {memberInfo.balance !== undefined
                            ? `${memberInfo.balance} $`
                            : "..."}
                        </p>
                      </div>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="walletAddress">
                          Wallet Address (BEP 20)
                        </Label>
                        <Input
                          id="walletAddress"
                          placeholder="Enter address"
                          {...form.register("walletAddress")}
                        />
                        {form.formState.errors.walletAddress && (
                          <p className="text-xs text-red-500">
                            {form.formState.errors.walletAddress.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          {...form.register("amount", {
                            valueAsNumber: true,
                          })}
                        />
                        {form.formState.errors.amount && (
                          <p className="text-xs text-red-500">
                            {form.formState.errors.amount.message}
                          </p>
                        )}
                        {!form.formState.errors.amount && (
                          <p className="text-xs text-muted-foreground mt-1">
                            *No Admin Charges apply
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Submitting..." : "Submit"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#f8fcf5]">
                <TableRow className="border-border">
                  <TableHead className="text-xs font-black uppercase tracking-widest w-[80px] py-2 px-3">
                    Sr. No.
                  </TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest py-2 px-3">
                    Date
                  </TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest py-2 px-3">
                    Remark
                  </TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest py-2 px-3">
                    Activity
                  </TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest py-2 px-3">
                    Total
                  </TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest py-2 px-3">
                    Admin Charges
                  </TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest py-2 px-3">
                    Amount
                  </TableHead>
                  <TableHead className="text-xs font-black uppercase tracking-widest text-right py-2 px-3">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.map((row, index) => {
                  const date = new Date(row.createdAt);
                  const formattedDate = `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB")}`;
                  const displayStatus =
                    row.status.charAt(0).toUpperCase() + row.status.slice(1);
                  return (
                    <TableRow
                      key={row._id}
                      className="border-border hover:bg-muted/20 transition-colors group"
                    >
                      <TableCell className="text-sm font-bold text-muted-foreground py-2 px-3">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-foreground py-2 px-3">
                        <div className="flex flex-col gap-0.5">
                          <span>{formattedDate.split(" ")[0]}</span>
                          <span className="text-xs text-muted-foreground font-mono leading-none">
                            {formattedDate.split(" ")[1]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-500 italic py-2 px-3">
                        Withdrawal to {row.walletAddress}
                      </TableCell>
                      <TableCell className="py-2 px-3">
                        <span className="text-xs font-black uppercase tracking-tight bg-[#ebf3e2] text-[#7db538] px-2.5 py-1 rounded">
                          Withdrawal
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-black text-foreground/80 py-2 px-3">
                        {Number(row.amount).toFixed(2)} $
                      </TableCell>
                      <TableCell className="text-sm font-bold text-[#ff4d4f] py-2 px-3">
                        0.00 $
                      </TableCell>
                      <TableCell className="text-base font-black text-foreground py-2 px-3">
                        {Number(row.amount).toFixed(2)} $
                      </TableCell>
                      <TableCell className="text-right py-2 px-3">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs font-black uppercase tracking-tight shadow-sm ${
                            displayStatus === "Paid" ||
                            displayStatus === "Approved"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : displayStatus === "Pending"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : "bg-rose-50 text-rose-600 border-rose-200"
                          }`}
                        >
                          {(displayStatus === "Paid" ||
                            displayStatus === "Approved") && (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          {displayStatus === "Pending" && (
                            <Clock className="h-4 w-4 animate-pulse" />
                          )}
                          {(displayStatus === "Rejected" ||
                            displayStatus === "Failed") && (
                            <XCircle className="h-4 w-4" />
                          )}
                          {displayStatus}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
