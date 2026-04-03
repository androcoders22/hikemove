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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMemberTreeAPI } from "@/lib/api/member";
import { getMemberStatus } from "@/lib/utils/member-status";

interface TeamRow {
  _id: string;
  memberId: string;
  fullName: string;
  package: string;
  sponsorId: any;
  sponsorMemberId?: string;
  sponsorFullName?: string;
  createdAt: string;
  activationDate: string | null;
  expirationDate?: string | null;
  status: string;
  level?: number;
}

export default function MyTeam() {
  const [teamData, setTeamData] = useState<TeamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMemberTreeAPI();
        if (response.data?.status && response.data.data) {
          const rawTree = response.data.data;
          const flattened = flattenTree(rawTree);

          // Create a lookup map for MongoID -> Member Details
          const idMap: Record<string, { memberId: string; fullName: string }> =
            {};
          flattened.forEach((m) => {
            idMap[m._id] = { memberId: m.memberId, fullName: m.fullName };
          });

          // Enrich data with sponsor's human-readable info
          const enriched = flattened.map((m) => {
            const sponsorInfo =
              typeof m.sponsorId === "string" ? idMap[m.sponsorId] : null;
            return {
              ...m,
              sponsorMemberId: sponsorInfo
                ? sponsorInfo.memberId
                : typeof m.sponsorId === "object"
                  ? m.sponsorId?.memberId
                  : null,
              sponsorFullName: sponsorInfo
                ? sponsorInfo.fullName
                : typeof m.sponsorId === "object"
                  ? m.sponsorId?.fullName
                  : "N/A",
            };
          });

          // Exclude the root member (the current user) from "My Team" list
          setTeamData(enriched.slice(1));
        } else {
          setError("Failed to load team data");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const flattenTree = (node: any, currentLevel: number = 0): any[] => {
    const resolvedLevel =
      typeof node.level === "number" ? node.level : currentLevel;
    let result: any[] = [{ ...node, level: resolvedLevel }];
    if (node.downlines && Array.isArray(node.downlines)) {
      node.downlines.forEach((child: any) => {
        result = [...result, ...flattenTree(child, resolvedLevel + 1)];
      });
    }
    return result;
  };

  const activeCount = useMemo(
    () => teamData.filter((m) => getMemberStatus(m) === "active").length,
    [teamData],
  );

  const inactiveCount = useMemo(
    () => teamData.filter((m) => getMemberStatus(m) !== "active").length,
    [teamData],
  );

  const totalBusiness = useMemo(() => {
    return teamData.reduce((acc, curr) => {
      const pkg = parseFloat(curr.package) || 0;
      return acc + pkg;
    }, 0);
  }, [teamData]);

  const stats = [
    {
      label: "Total Business",
      value: `$ ${totalBusiness}`,
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Active Team Members",
      value: activeCount.toString(),
      icon: UserCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Inactive Team Members",
      value: inactiveCount.toString(),
      icon: UserMinus,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
  ];

  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return teamData;

    return teamData.filter((row) => {
      const sId = row.sponsorMemberId || "";
      const sName = row.sponsorFullName || "";

      return (
        row.memberId.toLowerCase().includes(query) ||
        row.fullName.toLowerCase().includes(query) ||
        (row.package || "").toLowerCase().includes(query) ||
        sId.toLowerCase().includes(query) ||
        sName.toLowerCase().includes(query) ||
        getMemberStatus(row).includes(query)
      );
    });
  }, [teamData, searchTerm]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <PageHeader
          title="My Team"
          breadcrumbs={[
            { title: "My Team", href: "#" },
            { title: "Team List" },
          ]}
        />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

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
              Team List
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

              {/* <Button
                variant="outline"
                size="sm"
                className="h-8 text-[10px] font-bold"
              >
                <Filter className="h-3.5 w-3.5 mr-2" />
                FILTER
              </Button> */}
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
                    Join Date
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest border-r border-border/10">
                    Activation Date
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">
                    Level
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

                      <TableCell className="text-[10px] font-medium text-muted-foreground">
                        {formatDate(row.createdAt)}
                      </TableCell>
                      <TableCell className="text-[10px] font-medium text-muted-foreground">
                        {row.activationDate
                          ? formatDate(row.activationDate)
                          : "No Active"}
                      </TableCell>
                      <TableCell className="text-center font-black text-xs text-primary">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 font-bold">
                          Lvl {row.level || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {(() => {
                           const calculatedStatus = getMemberStatus(row);
                           return (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${
                                calculatedStatus === "active"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-rose-500/10 text-rose-500"
                              }`}
                            >
                              {calculatedStatus}
                            </span>
                           );
                        })()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-sm text-muted-foreground"
                    >
                      No team member found.
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
