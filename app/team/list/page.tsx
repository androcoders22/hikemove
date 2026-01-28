"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Users,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  UserMinus,
  Contact,
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

interface TeamRow {
  srNo: number;
  memberId: string;
  memberName: string;
  contactNo: string;
  currentPackage: string;
  sponsorId: string;
  sponsorName: string;
  joinDate: string;
  activationDate: string;
  status: "ACTIVE" | "INACTIVE";
}

export default function MyTeam() {
  const [teamData] = useState<TeamRow[]>([
    {
      srNo: 1,
      memberId: "HM9623400",
      memberName: "BHAVIN SONGARA",
      contactNo: "9016653966",
      currentPackage: "600 $",
      sponsorId: "HM8349314",
      sponsorName: "HM01",
      joinDate: "Nov 30 2025 3:45:48:600PM",
      activationDate: "Nov 30 2025 4:07:34:273PM",
      status: "ACTIVE",
    },
    {
      srNo: 2,
      memberId: "HM5809294",
      memberName: "SIVARAMAN",
      contactNo: "8870191889",
      currentPackage: "1000 $",
      sponsorId: "HM8349314",
      sponsorName: "HM01",
      joinDate: "Nov 27 2025 5:32:00:877PM",
      activationDate: "Nov 29 2025 3:29:48:297PM",
      status: "ACTIVE",
    },
    {
      srNo: 3,
      memberId: "HM8270370",
      memberName: "JIGNESH A VADHER",
      contactNo: "09687514957",
      currentPackage: "500 $",
      sponsorId: "HM8349314",
      sponsorName: "HM01",
      joinDate: "Nov 27 2025 2:11:24:697PM",
      activationDate: "Nov 27 2025 4:21:28:533PM",
      status: "ACTIVE",
    },
    {
      srNo: 4,
      memberId: "HM4071480",
      memberName: "SUSHIL KUMAR2",
      contactNo: "+919829170281",
      currentPackage: "100 $",
      sponsorId: "HM5206394",
      sponsorName: "SUSHIL KUMAR1",
      joinDate: "Nov 26 2025 1:17:30:057PM",
      activationDate: "Nov 27 2025 12:25:15:367AM",
      status: "ACTIVE",
    },
  ]);

  const stats = [
    {
      label: "Total Business",
      value: "55000",
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Active Direct Members",
      value: "176",
      icon: UserCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Inactive Direct Members",
      value: "12",
      icon: UserMinus,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="My Team"
        breadcrumbs={[
          { title: "My Team", href: "#" },
          { title: "My Team List" },
        ]}
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
              Team List
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
                    Sponsor Id
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Sponsor Name
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Join Date
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest border-r border-border/10">
                    Activation Date
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamData.map((row) => (
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
                    <TableCell className="text-xs font-bold text-primary/80">
                      {row.sponsorId}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground/80">
                      {row.sponsorName}
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
