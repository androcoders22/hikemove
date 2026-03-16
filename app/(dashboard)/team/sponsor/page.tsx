"use client";

import React, { useMemo, useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Users,
  Search,
  Filter,
  TrendingUp,
  UserCheck,
  UserMinus,
  Loader2,
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDirectMembersAPI } from "@/lib/api/member";

interface MemberRow {
  _id: string;
  memberId: string;
  fullName: string;
  package: string;
  sponsorId?: {
    _id: string;
    fullName: string;
    memberId: string;
  };
  createdAt: string;
  activationDate: string | null;
  status: string;
  sponsor?: { memberId?: string; fullName?: string } | string;
}

export default function MySponsor() {
  const [memberData, setMemberData] = useState<MemberRow[]>([]);
  const [currentUser, setCurrentUser] = useState<{ memberId?: string; fullName?: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDirectMembersAPI();
        if (response.data?.status && Array.isArray(response.data.data)) {
          setMemberData(response.data.data);
        } else {
          setError("Failed to load members data");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    // Fallback: Since these are direct members, the sponsor is the current user
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          setCurrentUser(JSON.parse(userStr));
        } else {
          // Alternative: we might have memberId stored directly
          const mid = localStorage.getItem("memberId");
          if (mid) setCurrentUser({ memberId: mid, fullName: "Me" });
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const activeCount = useMemo(() =>
    memberData.filter(m => m.status.toLowerCase() === "active").length,
    [memberData]);

  const inactiveCount = useMemo(() =>
    memberData.filter(m => m.status.toLowerCase() !== "active").length,
    [memberData]);

  const stats = [
    {
      label: "Total Members",
      value: memberData.length.toString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Active Members",
      value: activeCount.toString(),
      icon: UserCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Inactive Members",
      value: inactiveCount.toString(),
      icon: UserMinus,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
  ];

  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return memberData.filter((row) => {
      // Status filter
      if (statusFilter !== "all" && row.status.toLowerCase() !== statusFilter) {
        return false;
      }

      if (!query) return true;

      // Robust sponsor extraction
      let sponsorObj = row.sponsorId || row.sponsor;
      let sId = typeof sponsorObj === 'object' && sponsorObj ? sponsorObj.memberId : (typeof sponsorObj === 'string' ? sponsorObj : currentUser.memberId);
      let sName = typeof sponsorObj === 'object' && sponsorObj ? sponsorObj.fullName : currentUser.fullName;
      
      sId = sId || "";
      sName = sName || "";

      return (
        row.memberId.toLowerCase().includes(query) ||
        row.fullName.toLowerCase().includes(query) ||
        (row.package || "").toLowerCase().includes(query) ||
        sId.toLowerCase().includes(query) ||
        sName.toLowerCase().includes(query) ||
        row.status.toLowerCase().includes(query)
      );
    });
  }, [memberData, searchTerm, statusFilter, currentUser]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <PageHeader title="Direct Members" breadcrumbs={[{ title: "My Team", href: "#" }, { title: "Direct Members" }]} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Direct Members"
        breadcrumbs={[{ title: "My Team", href: "#" }, { title: "Direct Members" }]}
      />

      <div className="flex-1 p-6 space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm font-bold border border-destructive/20">
            {error}
          </div>
        )}

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
              Direct Members List
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 text-[10px] font-bold ${statusFilter !== "all" ? "bg-primary/10 text-primary border-primary/20" : ""}`}
                  >
                    <Filter className="h-3.5 w-3.5 mr-2" />
                    {statusFilter === "all" ? "FILTER" : statusFilter.toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuLabel className="text-xs font-black uppercase text-muted-foreground">Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter("all")}
                    className={statusFilter === "all" ? "bg-muted font-bold" : ""}
                  >
                    All Members
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter("active")}
                    className={statusFilter === "active" ? "bg-muted font-bold text-emerald-600" : "text-emerald-600"}
                  >
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter("inactive")}
                    className={statusFilter === "inactive" ? "bg-muted font-bold text-rose-600" : "text-rose-600"}
                  >
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Activation Date
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">
                    Status
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
                      <TableCell className="text-xs font-black text-primary">
                        {row.memberId}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-foreground">
                        {row.fullName}
                      </TableCell>

                      <TableCell className="text-xs font-black text-foreground">
                        {row.package || "N/A"}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-primary/80">
                        {(() => {
                           let sponsorObj = row.sponsorId || row.sponsor;
                           let sId = typeof sponsorObj === 'object' && sponsorObj ? sponsorObj.memberId : (typeof sponsorObj === 'string' ? sponsorObj : currentUser.memberId);
                           return sId || "N/A";
                        })()}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground/80">
                        {(() => {
                           let sponsorObj = row.sponsorId || row.sponsor;
                           let sName = typeof sponsorObj === 'object' && sponsorObj ? sponsorObj.fullName : currentUser.fullName;
                           return sName || "N/A";
                        })()}
                      </TableCell>
                      <TableCell className="text-[10px] font-medium text-muted-foreground">
                        {formatDate(row.createdAt)}
                      </TableCell>
                      <TableCell className="text-[10px] font-medium text-muted-foreground">
                        {row.activationDate ? formatDate(row.activationDate) : "No Active"}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${row.status.toLowerCase() === "active"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-rose-500/10 text-rose-500"
                            }`}
                        >
                          {row.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-6 text-sm text-muted-foreground"
                    >
                      No members found.
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
