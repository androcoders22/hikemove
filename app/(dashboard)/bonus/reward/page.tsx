"use client";

import React, { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Trophy, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface RewardBonusRow {
  _id: string;
  memberId: string;
  memberName: string;
  amount: number;
  createdAt: string;
}

export default function RewardBonus() {
  const [bonusData] = useState<RewardBonusRow[]>([
    {
      _id: "1",
      memberId: "HM123456",
      memberName: "John Doe",
      amount: 100,
      createdAt: "2026-01-24T10:30:00.000Z",
    },
    {
      _id: "2",
      memberId: "HM654321",
      memberName: "Jane Smith",
      amount: 250,
      createdAt: "2026-01-23T09:15:00.000Z",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return bonusData;

    return bonusData.filter((row) => {
      return (
        row.memberId.toLowerCase().includes(query) ||
        row.memberName.toLowerCase().includes(query) ||
        row.amount.toString().includes(query) ||
        row.createdAt.toLowerCase().includes(query)
      );
    });
  }, [bonusData, searchTerm]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Reward Bonus"
        breadcrumbs={[
          { title: "My Bonus", href: "#" },
          { title: "Reward Bonus" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              Reward Bonus History
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

          <div className="overflow-x-auto min-h-25">
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
                  filteredData.map((row, idx) => (
                    <TableRow
                      key={row._id}
                      className="border-border hover:bg-muted/20 transition-colors group"
                    >
                      <TableCell className="text-xs font-bold text-muted-foreground">
                        {idx + 1}
                      </TableCell>

                      <TableCell className="text-xs font-black text-primary tracking-tight">
                        rewardBonus
                      </TableCell>

                      <TableCell className="text-xs font-bold text-muted-foreground uppercase">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] tracking-widest bg-emerald-500/10 text-emerald-500">
                          credit
                        </span>
                      </TableCell>

                      <TableCell className="text-xs font-bold text-foreground">
                        Reward bonus for {row.memberName} ({row.memberId})
                      </TableCell>

                      <TableCell className="text-xs font-bold text-muted-foreground uppercase">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] tracking-widest bg-emerald-500/10 text-emerald-500">
                          approved
                        </span>
                      </TableCell>

                      <TableCell className="text-xs font-black text-emerald-600">
                        $ {row.amount}
                      </TableCell>

                      <TableCell className="text-right text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                        {formatDate(row.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-sm text-muted-foreground"
                    >
                      No reward bonus record found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
