"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  WalletCards,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  ArrowUpRight,
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

interface WalletHistoryRow {
  srNo: number;
  date: string;
  remark: string;
  activity: string;
  total: string;
  adminCharges: string;
  amount: string;
  status: "Completed" | "Processing";
}

export default function WalletHistory() {
  const [historyData] = useState<WalletHistoryRow[]>([
    {
      srNo: 1,
      date: "28/01/2026 14:30:22",
      remark: "Direct Sponsor Income",
      activity: "Credit",
      total: "50.00 $",
      adminCharges: "0.00 $",
      amount: "50.00 $",
      status: "Completed",
    },
    {
      srNo: 2,
      date: "27/01/2026 09:15:45",
      remark: "Weekly Profit Sharing",
      activity: "Credit",
      total: "75.50 $",
      adminCharges: "0.00 $",
      amount: "75.50 $",
      status: "Completed",
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Wallet History"
        breadcrumbs={[
          { title: "Withdrawal Wallet", href: "#" },
          { title: "Wallet History" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <WalletCards className="h-4 w-4 text-primary" />
              Wallet Transaction Logs
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[10px] font-bold"
              >
                <Search className="h-3.5 w-3.5 mr-2" />
                SEARCH
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[10px] font-bold"
              >
                <Filter className="h-3.5 w-3.5 mr-2" />
                FILTER
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest w-[80px]">
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
                    Total
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Admin Charges
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Amount
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.map((row) => (
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
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {row.date.split(" ")[1]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-500 italic">
                      "{row.remark}"
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-black uppercase tracking-tight bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <ArrowUpRight className="h-3 w-3" />
                        {row.activity}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-black text-foreground/80">
                      {row.total}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-rose-500/80">
                      {row.adminCharges}
                    </TableCell>
                    <TableCell className="text-sm font-black text-primary">
                      {row.amount}
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm ${
                          row.status === "Completed"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {row.status === "Completed" && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {row.status === "Processing" && (
                          <Clock className="h-3 w-3 animate-pulse" />
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
