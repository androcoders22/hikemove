"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { getActiveMembersAPI } from "@/lib/api/admin";
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
import { Search, UserCheck, Shield, Key, Smartphone, Users, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getMemberStatus } from "@/lib/utils/member-status";
import { format } from "date-fns";

export default function ActiveMembersListPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getActiveMembersAPI();
        const allMembers = res.data?.data || res.data || [];
        // Filter for active members only
        const activeOnly = allMembers.filter((m: any) => getMemberStatus(m) === "active");
        setMembers(activeOnly);
      } catch (err) {
        console.error("Failed to fetch active members", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) =>
    member.memberId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <PageHeader
        title="Active Members List"
        breadcrumbs={[{ title: "Admin", href: "#" }, { title: "Members", href: "#" }, { title: "Active" }]}
      />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-400 mx-auto w-full">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Active Members</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Manage and view all members with an active package</p>
              </div>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or Name..."
                className="pl-10 h-10 border-muted-foreground/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 border-t">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider py-4">Sr No.</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider py-4">Member ID</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider py-4">Member Name</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider py-4 text-center">Current Package</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider py-4">Sponsor ID</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider py-4">Sponsor Name</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider py-4">
                        <div className="flex items-center gap-1"><Key className="h-3 w-3" /> Login Pwd</div>
                    </TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider py-4">
                        <div className="flex items-center gap-1"><Shield className="h-3 w-3" /> Txn Pwd</div>
                    </TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider py-4">
                        <div className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> Mobile</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center text-muted-foreground italic">
                        Loading active member records...
                      </TableCell>
                    </TableRow>
                  ) : filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-32 text-center text-muted-foreground italic">
                        No active members found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member, index) => (
                      <TableRow key={member._id || index} className="group hover:bg-muted/20 transition-colors">
                        <TableCell className="font-medium text-xs py-4">{index + 1}</TableCell>
                        <TableCell className="font-black text-xs py-4 text-primary">{member.memberId}</TableCell>
                        <TableCell className="font-bold text-xs py-4 truncate max-w-37.5">{member.fullName}</TableCell>
                        <TableCell className="py-4 text-center">
                          <Badge variant="outline" className="bg-green-500/5 text-green-600 border-green-500/10 font-bold">
                            ${member.packageAmount || member.currentPackage || "0"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-xs py-4 text-muted-foreground">{member.sponsorId || "N/A"}</TableCell>
                        <TableCell className="font-medium text-xs py-4 truncate max-w-30">{member.sponsorName || "N/A"}</TableCell>
                        <TableCell className="font-mono text-[10px] py-4">{member.password || "********"}</TableCell>
                        <TableCell className="font-mono text-[10px] py-4">{member.txnPassword || "********"}</TableCell>
                        <TableCell className="font-medium text-xs py-4">{member.phone || member.mobile || "N/A"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}