"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { PageHeader } from "@/components/page-header";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getWalletAPI } from "@/lib/api/wallet";
import {
  checkMemberIdAPI,
  createMemberTopupAPI,
  getMemberTopupsAPI,
} from "@/lib/api/member-topup";
import {
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Loader2,
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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

interface TopUpRecord {
  _id?: string;
  srNo?: number;
  toMember?: any;
  amount: number;
  status: string;
  createdAt?: string;
}

export default function MemberTopUp() {
  const [records, setRecords] = useState<TopUpRecord[]>([]);
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [incomeBalance, setIncomeBalance] = useState<number>(0);
  const [memberName, setMemberName] = useState("");
  const [memberObjectId, setMemberObjectId] = useState("");
  const [isCheckingMember, setIsCheckingMember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch wallet balance
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await getWalletAPI();
        if (res.data?.status) {
          setIncomeBalance(res.data.data.incomeBalance || 0);
        }
      } catch (err) {
        console.error("Failed to fetch wallet", err);
      }
    };
    fetchWallet();
  }, []);

  // Fetch topup records
  const fetchRecords = useCallback(async () => {
    try {
      const res = await getMemberTopupsAPI();
      if (res.data?.status) {
        setRecords(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch topup records", err);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const formSchema = useMemo(
    () =>
      z.object({
        package: z
          .string()
          .min(1, { message: "Package is required" })
          .refine((val) => Number(val) <= incomeBalance, {
            message: `Amount exceeds income balance ($${incomeBalance})`,
          }),
        memberId: z.string().min(1, { message: "Member Id is required" }),
      }),
    [incomeBalance],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { package: "", memberId: "" },
  });

  const watchedMemberId = form.watch("memberId");

  // Debounced member lookup via API
  useEffect(() => {
    const id = watchedMemberId?.toUpperCase() || "";
    if (id.length < 3) {
      setMemberName("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingMember(true);
      try {
        const res = await checkMemberIdAPI(id);
        if (res.data?.status && res.data.data) {
          setMemberName(res.data.data.fullName || "");
          setMemberObjectId(res.data.data._id || "");
        } else {
          setMemberName("");
          setMemberObjectId("");
        }
      } catch {
        setMemberName("");
        setMemberObjectId("");
      } finally {
        setIsCheckingMember(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [watchedMemberId]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isActivationOpen) {
      form.reset();
      setMemberName("");
      setMemberObjectId("");
    }
  }, [isActivationOpen, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!memberName) {
      toast.error("Please enter a valid Member ID");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createMemberTopupAPI({
        toMember: memberObjectId,
        amount: Number(values.package),
      });

      if (res.data?.status) {
        setIncomeBalance((prev) => prev - Number(values.package));
        setIsActivationOpen(false);
        toast.success(
          `Success: ${values.memberId.toUpperCase()} activated with $${values.package}`,
        );
        fetchRecords();
      } else {
        toast.error(res.data?.message || "Activation failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Member Activation"
        breadcrumbs={[{ title: "App", href: "#" }, { title: "Activations" }]}
      />

      <div className="flex-1 px-6 py-4 space-y-4">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
              Activation History
            </h2>
            <p className="text-xs text-muted-foreground">
              List of all member top-ups and activations
            </p>
          </div>

          <Dialog open={isActivationOpen} onOpenChange={setIsActivationOpen}>
            <DialogTrigger asChild>
              <Button className="font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-9 px-4 rounded-lg transition-all">
                <Plus className="h-4 w-4 mr-2" />
                ACTIVATE MEMBER
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] p-0 border-border bg-background shadow-2xl overflow-hidden rounded-2xl [&>button]:top-3 [&>button]:right-3 [&>button]:text-primary-foreground [&>button]:opacity-70 [&>button]:hover:opacity-100">
              <div className="bg-primary p-4 pb-3 text-primary-foreground relative">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-5 w-5 opacity-80" />
                  <DialogTitle className="text-lg font-black tracking-tight uppercase">
                    New Activation
                  </DialogTitle>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">
                    Secured transaction protocol
                  </p>
                  <div className="text-right">
                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-wider">
                      Balance
                    </p>
                    <p className="text-sm font-black">${incomeBalance}</p>
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="p-5 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="package"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[10px] m-0 font-black uppercase tracking-widest text-muted-foreground">
                            Select Package
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-9 font-bold border-border bg-muted/30 focus:ring-0 rounded-lg w-full">
                                <SelectValue placeholder="Amount" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-border">
                              {[
                                "100",
                                "500",
                                "1000",
                                "5000",
                                "10000",
                                "25000",
                                "50000",
                              ].map((pkg) => (
                                <SelectItem
                                  key={pkg}
                                  value={pkg}
                                  className="font-bold cursor-pointer"
                                >
                                  ${pkg}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="memberId"
                      render={({ field }) => (
                        <FormItem className="space-y-1.5">
                          <FormLabel className="text-[10px] m-0 font-black uppercase tracking-widest text-muted-foreground">
                            Member Id
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="HM..."
                              className="h-9 font-bold border-border bg-muted/30 focus:ring-0 rounded-lg uppercase"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-1.5 bg-muted/30 p-3 rounded-xl border border-border/50">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Validated Name
                    </Label>
                    <div className="flex items-center gap-2">
                      {isCheckingMember ? (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      ) : (
                        <div
                          className={`h-2 w-2 rounded-full ${memberName ? "bg-emerald-500" : "bg-muted-foreground/30"} animate-pulse`}
                        ></div>
                      )}
                      <span className="text-sm font-black text-foreground truncate">
                        {isCheckingMember
                          ? "Checking..."
                          : memberName || "No member found..."}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 font-black text-sm uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 "
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    {isSubmitting ? "Processing..." : "Confirm Transaction"}
                    {!isSubmitting && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dense Financial Grid Layout (No Cards) */}
        <div className="border border-border rounded-xl bg-background shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30 border-b border-border">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-16 h-10 text-[10px] font-black uppercase tracking-widest">
                    Sr.
                  </TableHead>
                  <TableHead className="h-10 text-[10px] font-black uppercase tracking-widest">
                    Member ID
                  </TableHead>
                  <TableHead className="h-10 text-[10px] font-black uppercase tracking-widest">
                    Full Name
                  </TableHead>
                  <TableHead className="h-10 text-[10px] font-black uppercase tracking-widest">
                    Package
                  </TableHead>
                  <TableHead className="h-10 text-[10px] font-black uppercase tracking-widest">
                    Processed On
                  </TableHead>
                  <TableHead className="h-10 text-[10px] font-black uppercase tracking-widest text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((row, index) => (
                  <TableRow
                    key={row._id || index}
                    className="border-border hover:bg-muted/20 transition-colors group"
                  >
                    <TableCell className="text-[11px] font-bold text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center font-mono text-[11px] font-black bg-primary/5 text-primary px-2 py-0.5 rounded-md border border-primary/10">
                        {row.toMember?.memberId || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-black text-foreground uppercase truncate max-w-[150px]">
                      {row.toMember?.fullName || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-black text-slate-900">
                        <div className="h-6 w-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">
                          $
                        </div>
                        <span className="text-sm">{row.amount}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] font-bold text-muted-foreground italic">
                      {row.createdAt
                        ? format(
                            new Date(row.createdAt),
                            "dd-MMM-yyyy hh:mm:ss a",
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 h-6 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          row.status === "confirmed" ||
                          row.status === "Confirmed"
                            ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
                            : row.status === "rejected" ||
                                row.status === "Rejected"
                              ? "bg-red-500/5 text-red-600 border-red-500/20"
                              : "bg-amber-500/5 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {row.status === "confirmed" ||
                        row.status === "Confirmed" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
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
