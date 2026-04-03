"use client";

import React, { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { getAllMembersAPI } from "@/lib/api/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users, Shield, Key, Smartphone, UserCircle2, List, Clock, CheckCircle2, Wallet, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getMemberStatus } from "@/lib/utils/member-status";

export default function AllMembersListPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMembers = async () => {
    try {
      const res = await getAllMembersAPI();
      setMembers(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      member.memberId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  const resolvePackage = (row: any) => {
    if (Array.isArray(row.activePackages) && row.activePackages.length > 0) {
      return row.activePackages[0];
    }
    return row.packageAmount || row.currentPackage || "0";
  };

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#f6f8f4]">
      <PageHeader
        title="All Members List"
        breadcrumbs={[{ title: "Admin", href: "#" }, { title: "Members", href: "#" }, { title: "All" }]}
      />

      <div className="w-full min-w-0 flex-1 p-3 pt-0 sm:p-4 sm:pt-0 lg:p-5 lg:pt-0">
        <Card className="min-w-0 overflow-hidden rounded-lg border border-[#dce8d3] bg-white shadow-sm pt-0">
          <CardHeader className="border-b border-[#dce8d3] bg-[#fafcf8] px-3 py-3 sm:px-4 sm:py-4">
            <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/15 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base leading-tight font-extrabold uppercase tracking-[0.05em] text-[#4d553d] sm:text-lg">
                    All Members
                  </CardTitle>
                </div>
                <p className="text-[11px] font-medium text-[#7a8270] sm:text-xs">
                  Manage and view all registered platform members.
                </p>
              </div>

              <div className="relative group w-full min-w-0 xl:w-70">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a927e] transition-colors group-focus-within:text-primary" />
                <Input
                  placeholder="Search by ID or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 w-full min-w-0 rounded-md border-[#dce8d3] bg-white pl-9 pr-3 text-[13px] shadow-sm transition-all placeholder:text-[#9aa190] focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-3 sm:p-4">
            {!loading && filteredMembers.length === 0 ? (
              <div className="rounded-lg border border-[#dce8d3] shadow-sm">
                <div className="flex min-h-55 flex-col items-center justify-center px-4 text-center sm:min-h-60">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 ring-1 ring-[#dce8d3]">
                    <List className="h-6 w-6 text-[#a1a895]" />
                  </div>
                  <p className="text-base font-bold tracking-tight text-[#4d553d] sm:text-lg">
                    No members found
                  </p>
                  <p className="mt-1 max-w-md text-xs text-[#7a8270] sm:text-sm">
                    {searchTerm ? "No results matching your search criteria." : "There are currently no members in the system."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#dce8d3] shadow-sm">
                <div className="min-w-280">
                  <Table>
                    <TableHeader className="bg-[#f7fbf3]">
                      <TableRow className="border-b border-[#dce8d3] hover:bg-transparent">
                        <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">Sr.</TableHead>
                        <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">Member Id</TableHead>
                        <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">Name</TableHead>
                        <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">Package</TableHead>
                        <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">Sponsor Id</TableHead>
                        <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">Sponsor Name</TableHead>
                        <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">Password</TableHead>
                        <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">Txn Pin</TableHead>
                        <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f]">Mobile</TableHead>
                        <TableHead className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5c634f] text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i} className="border-b border-[#edf3e7]">
                            <TableCell colSpan={10} className="h-12 text-center text-[10px] text-muted-foreground italic">
                              Loading members...
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        filteredMembers.map((member, index) => (
                          <TableRow key={member._id || index} className="border-b border-[#edf3e7] transition-colors hover:bg-[#fbfdf8]">
                            <TableCell className="px-3 py-2.5 text-xs font-medium text-[#8a927e]">{index + 1}</TableCell>
                            <TableCell className="px-3 py-2.5 text-xs font-semibold text-primary">{member.memberId}</TableCell>
                            <TableCell className="px-3 py-2.5 text-xs font-medium text-[#5f6851] truncate max-w-40">{member.fullName}</TableCell>
                            <TableCell className="px-3 py-2.5">
                              <span className="inline-flex items-center gap-1 rounded bg-primary/5 px-2 py-0.5 text-[10px] font-bold text-primary ring-1 ring-primary/10">
                                ${resolvePackage(member)}
                              </span>
                            </TableCell>
                            <TableCell className="px-3 py-2.5 text-xs font-medium text-[#7a8270]">
                              {typeof member.sponsorId === 'object' ? member.sponsorId?.memberId : (member.sponsorId || "N/A")}
                            </TableCell>
                            <TableCell className="px-3 py-2.5 text-xs font-medium text-[#7a8270] truncate max-w-32">
                              {typeof member.sponsorId === 'object' ? member.sponsorId?.fullName : (member.sponsorName || "N/A")}
                            </TableCell>
                            <TableCell className="px-3 py-2.5 font-mono text-[10px] text-[#8a927e]">{member.password || "********"}</TableCell>
                            <TableCell className="px-3 py-2.5 font-mono text-[10px] text-[#8a927e]">{member.transactionPassword || member.txnPassword || "********"}</TableCell>
                            <TableCell className="px-3 py-2.5 text-[11px] font-medium text-[#5f6851]">{member.phone || member.mobile || "N/A"}</TableCell>
                            <TableCell className="px-3 py-2.5 text-right">
                              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.05em] ${
                                getMemberStatus(member) === "active"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-amber-200 bg-amber-50 text-amber-700"
                              }`}>
                                {getMemberStatus(member)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}