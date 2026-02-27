"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Plus,
  Wallet,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
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
  DialogHeader,
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
  srNo: number;
  memberId: string;
  memberName: string;
  amount: string;
  topupDate: string;
  status: "Confirmed" | "Pending" | "Rejected";
}

export default function MemberTopUp() {
  const [records, setRecords] = useState<TopUpRecord[]>([
    {
      srNo: 1,
      memberId: "HM7677514",
      memberName: "ALOK RANJAN",
      amount: "500 $",
      topupDate: "17-Nov-2025 02:28:45 PM",
      status: "Confirmed",
    },
    {
      srNo: 2,
      memberId: "HM1177194",
      memberName: "AMIT",
      amount: "100 $",
      topupDate: "17-Nov-2025 02:37:49 PM",
      status: "Confirmed",
    },
  ]);

  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [formData, setFormData] = useState({
    package: "",
    memberId: "",
    memberName: "",
    password: "",
  });

  const walletBalance = "4,400.00";

  const handleMemberIdChange = (id: string) => {
    setFormData((prev) => ({ ...prev, memberId: id }));
    if (id === "HM7677514") {
      setFormData((prev) => ({ ...prev, memberName: "ALOK RANJAN" }));
    } else if (id === "HM1177194") {
      setFormData((prev) => ({ ...prev, memberName: "AMIT" }));
    } else {
      setFormData((prev) => ({ ...prev, memberName: "" }));
    }
  };

  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.package || !formData.memberId || !formData.password) {
      toast.error("Required fields missing");
      return;
    }

    const newRecord: TopUpRecord = {
      srNo: records.length + 1,
      memberId: formData.memberId,
      memberName: formData.memberName || "Unknown User",
      amount: `${formData.package} $`,
      topupDate: format(new Date(), "dd-MMM-yyyy hh:mm:ss a"),
      status: "Confirmed",
    };

    setRecords([newRecord, ...records]);
    setIsActivationOpen(false);
    setFormData({ package: "", memberId: "", memberName: "", password: "" });
    toast.success(`Success: ${formData.memberId} Activated`);
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
            <DialogContent className="sm:max-w-[400px] p-0 border-border bg-background shadow-2xl overflow-hidden rounded-2xl">
              <div className="bg-primary p-4 text-primary-foreground relative">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-5 w-5 opacity-80" />
                  <DialogTitle className="text-lg font-black tracking-tight uppercase">
                    New Activation
                  </DialogTitle>
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">
                  Secured transaction protocol
                </p>
              </div>

              <form onSubmit={handleActivation} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Select Package
                    </Label>
                    <Select
                      onValueChange={(val) =>
                        setFormData({ ...formData, package: val })
                      }
                    >
                      <SelectTrigger className="h-9 font-bold border-border bg-muted/30 focus:ring-0 rounded-lg">
                        <SelectValue placeholder="Amount" />
                      </SelectTrigger>
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
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Member Id
                    </Label>
                    <Input
                      placeholder="HM..."
                      className="h-9 font-bold border-border bg-muted/30 focus:ring-0 rounded-lg uppercase"
                      value={formData.memberId}
                      onChange={(e) =>
                        handleMemberIdChange(e.target.value.toUpperCase())
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5 bg-muted/30 p-3 rounded-xl border border-border/50">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Validated Name
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-black text-foreground truncate">
                      {formData.memberName || "No member found..."}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Transaction Password
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground/30" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-9 border-border bg-muted/30 focus:ring-0 rounded-lg"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-black text-sm uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 "
                >
                  Confirm Transaction
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
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
                {records.map((row) => (
                  <TableRow
                    key={row.srNo}
                    className="border-border hover:bg-muted/20 transition-colors group"
                  >
                    <TableCell className="text-[11px] font-bold text-muted-foreground">
                      {row.srNo}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center font-mono text-[11px] font-black bg-primary/5 text-primary px-2 py-0.5 rounded-md border border-primary/10">
                        {row.memberId}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-black text-foreground uppercase truncate max-w-[150px]">
                      {row.memberName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-black text-slate-900">
                        <div className="h-6 w-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">
                          $
                        </div>
                        <span className="text-sm">
                          {row.amount.replace(" $", "")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] font-bold text-muted-foreground italic">
                      {row.topupDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 h-6 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          row.status === "Confirmed"
                            ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/5 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {row.status === "Confirmed" ? (
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
