"use client";

import React, { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Medal, Search, BarChart3 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface BusinessSummary {
  firstLeg: string;
  secondLeg: string;
  thirdLeg: string;
  total: string;
}

interface RewardListRow {
  srNo: number;
  rank: string;
  rewardName: string;
  rewardAmount: string;
  targetBusiness: string;
  currentBusiness: string;
}

export default function RewardList() {
  const [summary] = useState<BusinessSummary>({
    firstLeg: "440.00 $",
    secondLeg: "440.00 $",
    thirdLeg: "220.00 $",
    total: "1100.00 $",
  });

  const [rewardData] = useState<RewardListRow[]>([
    {
      srNo: 1,
      rank: "STAR",
      rewardName: "Smart Watch",
      rewardAmount: "50 $",
      targetBusiness: "1000 $",
      currentBusiness: "1100 $",
    },
    {
      srNo: 2,
      rank: "GOLD",
      rewardName: "Mobile Phone",
      rewardAmount: "200 $",
      targetBusiness: "5000 $",
      currentBusiness: "1100 $",
    },
    {
      srNo: 3,
      rank: "DIAMOND",
      rewardName: "Laptop",
      rewardAmount: "1000 $",
      targetBusiness: "25000 $",
      currentBusiness: "1100 $",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return rewardData;

    return rewardData.filter((row) => {
      return (
        row.rank.toLowerCase().includes(query) ||
        row.rewardName.toLowerCase().includes(query) ||
        row.rewardAmount.toLowerCase().includes(query) ||
        row.targetBusiness.toLowerCase().includes(query) ||
        row.currentBusiness.toLowerCase().includes(query)
      );
    });
  }, [rewardData, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Reward List"
        breadcrumbs={[
          { title: "My Bonus", href: "#" },
          { title: "Reward List" },
        ]}
      />

      {/* <div className="flex-1 p-6 space-y-6">
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/10">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Business Summary
            </h2>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center border-r border-border/50">
                    First Leg Business (40%)
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center border-r border-border/50">
                    Second Leg Business (40%)
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center border-r border-border/50">
                    Third Leg Business (20%)
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">
                    Total Business (100%)
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="text-center font-black text-foreground border-r border-border/50 py-6">
                    {summary.firstLeg}
                  </TableCell>
                  <TableCell className="text-center font-black text-foreground border-r border-border/50">
                    {summary.secondLeg}
                  </TableCell>
                  <TableCell className="text-center font-black text-foreground border-r border-border/50">
                    {summary.thirdLeg}
                  </TableCell>
                  <TableCell className="text-center font-black text-primary text-lg">
                    {summary.total}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <Medal className="h-4 w-4 text-primary" />
              Available Rewards
            </h2>

            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 pl-8 pr-3 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest w-20">
                    Sr. No.
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Type
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Entry Type
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Remarks
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Status
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Amount
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <TableRow
                      key={row.srNo}
                      className="border-border hover:bg-muted/20 transition-colors group"
                    >
                      <TableCell className="text-xs font-bold text-muted-foreground">
                        {row.srNo}
                      </TableCell>

                      <TableCell className="text-xs font-black text-primary tracking-tight">
                        rewardList
                      </TableCell>

                      <TableCell className="text-xs font-bold text-muted-foreground uppercase">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] tracking-widest bg-emerald-500/10 text-emerald-500">
                          credit
                        </span>
                      </TableCell>

                      <TableCell className="text-xs font-bold text-foreground">
                        {row.rank} - {row.rewardName}
                      </TableCell>

                      <TableCell className="text-xs font-bold text-muted-foreground uppercase">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] tracking-widest bg-emerald-500/10 text-emerald-500">
                          active
                        </span>
                      </TableCell>

                      <TableCell className="text-xs font-black text-emerald-600">
                        {row.rewardAmount}
                      </TableCell>

                      <TableCell className="text-right text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                        N/A
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-sm text-muted-foreground"
                    >
                      No reward found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div> */}
    </div>
  );
}