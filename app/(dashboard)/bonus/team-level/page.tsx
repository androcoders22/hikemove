"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Gift, Search, Filter, Calendar, Layers } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface TeamLevelBonusRow {
  srNo: number;
  memberId: string;
  memberName: string;
  packageAmount: string;
  amount: string;
  levelNo: number;
  date: string;
}

export default function TeamLevelBonus() {
  const [bonusData] = useState<TeamLevelBonusRow[]>([
    {
      srNo: 1,
      memberId: "HM123456",
      memberName: "John Doe",
      packageAmount: "500 $",
      amount: "10 $",
      levelNo: 2,
      date: "28/01/2026",
    },
    {
      srNo: 2,
      memberId: "HM654321",
      memberName: "Jane Smith",
      packageAmount: "1000 $",
      amount: "25 $",
      levelNo: 3,
      date: "27/01/2026",
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Team Level Bonus"
        breadcrumbs={[
          { title: "My Bonus", href: "#" },
          { title: "Team Level Bonus" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              Team Level Bonus History
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
                    Member Id
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Member Name
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Package Amount
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Amount
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Level No.
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bonusData.map((row) => (
                  <TableRow
                    key={row.srNo}
                    className="border-border hover:bg-muted/20 transition-colors group"
                  >
                    <TableCell className="text-xs font-bold text-muted-foreground">
                      {row.srNo}
                    </TableCell>
                    <TableCell className="text-xs font-black text-primary">
                      {row.memberId}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      {row.memberName}
                    </TableCell>
                    <TableCell className="text-xs font-black text-foreground/80">
                      {row.packageAmount}
                    </TableCell>
                    <TableCell className="text-xs font-black text-emerald-600">
                      {row.amount}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase">
                        <Layers className="h-3 w-3" />
                        Level {row.levelNo}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs font-medium text-muted-foreground">
                      <div className="flex items-center justify-end gap-2">
                        <Calendar className="h-3 w-3 opacity-50" />
                        {row.date}
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
