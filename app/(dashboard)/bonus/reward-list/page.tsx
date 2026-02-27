"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Medal, Search, Filter, BarChart3 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Reward List"
        breadcrumbs={[
          { title: "My Bonus", href: "#" },
          { title: "Reward List" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Business Summary Table */}
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

        {/* Reward List Table */}
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <Medal className="h-4 w-4 text-primary" />
              Available Rewards
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
                    Rank
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Reward Name
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Reward Amount
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Target Business
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">
                    Current Business
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewardData.map((row) => (
                  <TableRow
                    key={row.srNo}
                    className="border-border hover:bg-muted/20 transition-colors group"
                  >
                    <TableCell className="text-xs font-bold text-muted-foreground">
                      {row.srNo}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase">
                        {row.rank}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      {row.rewardName}
                    </TableCell>
                    <TableCell className="text-xs font-black text-emerald-600">
                      {row.rewardAmount}
                    </TableCell>
                    <TableCell className="text-xs font-black text-rose-600/80">
                      {row.targetBusiness}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-black text-primary">
                          {row.currentBusiness}
                        </span>
                        <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${Math.min(100, (parseFloat(row.currentBusiness) / parseFloat(row.targetBusiness)) * 100)}%`,
                            }}
                          />
                        </div>
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
