"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Users,
  Search,
  Filter,
  TrendingUp,
  UserCheck,
  UserMinus,
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

interface SponsorRow {
  srNo: number;
  memberId: string;
  memberName: string;
  contactNo: string;
  currentPackage: string;
  joinDate: string;
  activationDate: string;
  status: "ACTIVE" | "INACTIVE";
}

export default function MySponsor() {
  const [sponsorData] = useState<SponsorRow[]>([
    {
      srNo: 1,
      memberId: "HM3347546",
      memberName: "ASHISH KUMAR",
      contactNo: "0522375835",
      currentPackage: "1000 $",
      joinDate: "Nov 17 2025 3:24:36:703PM",
      activationDate: "Nov 17 2025 3:32:01:760PM",
      status: "ACTIVE",
    },
  ]);

  const stats = [
    {
      label: "Total Business",
      value: "1100",
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Active Direct Members",
      value: "2",
      icon: UserCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Inactive Direct Members",
      value: "0",
      icon: UserMinus,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="My Sponsor"
        breadcrumbs={[{ title: "My Team", href: "#" }, { title: "My Sponsor" }]}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Summary Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-xl p-4 flex items-center justify-between group hover:border-primary/30 transition-all shadow-sm"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Table Area */}
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Sponsor Details
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
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Sr. No.
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Member Id
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Member Name
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Contact No.
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Current Package
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Join Date
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Activation Date
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsorData.map((row) => (
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
                    <TableCell className="text-xs font-medium text-muted-foreground">
                      {row.contactNo}
                    </TableCell>
                    <TableCell className="text-xs font-black text-foreground">
                      {row.currentPackage}
                    </TableCell>
                    <TableCell className="text-[10px] font-medium text-muted-foreground">
                      {row.joinDate}
                    </TableCell>
                    <TableCell className="text-[10px] font-medium text-muted-foreground">
                      {row.activationDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${
                          row.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {row.status}
                      </span>
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
