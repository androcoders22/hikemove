"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Package, Loader2, Calendar, DollarSign, Repeat } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMemberPackagesAPI } from "@/lib/api/member";

interface MemberPackageRow {
  _id: string;
  fromMember: {
    memberId: string;
    fullName: string;
  };
  amount: number;
  incomeReleasedCounter: number;
  lastIncomeReleaseDate: string | null;
  nextIncomeReleaseDate: string | null;
  roiPercentage?: number;
  status: string;
  createdAt: string;
}

export default function MemberPackagePage() {
  const [packages, setPackages] = useState<MemberPackageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getMemberPackagesAPI();
        if (response.data?.status && Array.isArray(response.data.data)) {
          setPackages(response.data.data);
        } else {
          setPackages([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

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
        title="Member Package"
        breadcrumbs={[
          { title: "Overview", href: "/dashboard" },
          { title: "Member Package" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6">
        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              Purchase History
            </h2>
          </div>

          <div className="overflow-x-auto min-h-25">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p className="text-sm font-bold">Loading your packages...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center text-destructive">
                <p className="font-bold">{error}</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest w-16">
                      #
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
                      Acticvated By
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
                      Amount
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
                      Released
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
                      Last Release
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
                      Next Release
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">
                      ROI %
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {packages.length > 0 ? (
                    packages.map((pkg, idx) => (
                      <TableRow
                        key={pkg._id}
                        className="border-border hover:bg-muted/20 transition-colors group"
                      >
                        <TableCell className="text-xs font-bold text-muted-foreground">
                          {idx + 1}
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-primary uppercase tracking-tight">
                              {pkg.fromMember?.memberId || "N/A"}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[120px]">
                              {pkg.fromMember?.fullName || ""}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-xs font-black text-foreground">
                          <div className="flex items-center gap-1.5">
                            <div className="">
                              {/* <DollarSign className="h-3 w-3 text-primary" /> */}
                            </div>
                            <span>$ {pkg.amount}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Repeat className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-bold">
                              {pkg.incomeReleasedCounter} Times
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                          {pkg.lastIncomeReleaseDate ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 opacity-70" />
                              {formatDate(pkg.lastIncomeReleaseDate)}
                            </div>
                          ) : (
                            <span className="opacity-50">NOT RELEASED</span>
                          )}
                        </TableCell>

                        <TableCell className="text-[10px] font-bold text-primary whitespace-nowrap">
                          {pkg.nextIncomeReleaseDate ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(pkg.nextIncomeReleaseDate)}
                            </div>
                          ) : (
                            <span className="opacity-50 text-muted-foreground">N/A</span>
                          )}
                        </TableCell>

                        <TableCell className="text-center">
                          <span className="text-xs font-black text-amber-600">
                            {pkg.roiPercentage || "0"}%
                          </span>
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${pkg.status === "active"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-muted text-muted-foreground"
                              }`}
                          >
                            {pkg.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-12 text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Package className="h-8 w-8 opacity-20" />
                          <p className="font-bold">No active packages found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
