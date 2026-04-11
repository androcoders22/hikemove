"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/page-header";
import { PiggyBank, Search, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getWeeklyProfitBonusAPI } from "@/lib/api/ledger";

interface LedgerRow {
  _id: string;
  amount: number;
  ledgerType: string;
  entryType: string;
  description?: string;
  remarks?: string;
  createdAt: string;
  status?: string;
}

export default function WeeklyProfitBonus() {
  const [bonusData, setBonusData] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const fetchData = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      try {
        const response = await getWeeklyProfitBonusAPI(page, limit);
        const d = response.data;
        if (d?.status && d?.data) {
          let dataArray = [];
          let totalP = 1;

          const meta = d.metaData;
          if (meta?.totalPages) {
            totalP = Number(meta.totalPages);
          }

          if (Array.isArray(d.data)) {
            dataArray = d.data;
            if (!meta) totalP = d.totalPages || (d.total ? Math.ceil(d.total / limit) : 1);
          } else if (typeof d.data === "object") {
            dataArray =
              d.data.docs || d.data.list || d.data.records || d.data.data || [];
            if (!meta) totalP = d.data.totalPages || d.data.pages || d.totalPages || (d.data.total ? Math.ceil(d.data.total / limit) : 1);
          }
          setBonusData(dataArray);
          setTotalPages(totalP);
          setCurrentPage(page);
        } else {
          setBonusData([]);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return bonusData;

    return bonusData.filter((row) => {
      const desc = (row.description || row.remarks || "").toLowerCase();
      const lType = (row.ledgerType || "").toLowerCase();
      return (
        desc.includes(query) ||
        lType.includes(query) ||
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
        title="Weekly Profit Bonus"
        breadcrumbs={[
          { title: "My Bonus", href: "#" },
          { title: "Weekly Profit Bonus" },
        ]}
      />

      <div className="flex-1 p-6 space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm font-bold border border-destructive/20">
            {error}
          </div>
        )}

        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
            <h2 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-primary" />
              Weekly Profit Bonus History
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
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p className="text-sm font-bold">Loading records...</p>
              </div>
            ) : (
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
                    <TableHead className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
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
                        key={row._id || idx}
                        className="border-border hover:bg-muted/20 transition-colors group"
                      >
                        <TableCell className="text-xs font-bold text-muted-foreground">
                          {(currentPage - 1) * limit + idx + 1}
                        </TableCell>

                        <TableCell className="text-xs font-black text-primary tracking-tight">
                          {row.ledgerType || "N/A"}
                        </TableCell>

                        <TableCell className="text-xs font-bold text-muted-foreground uppercase">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] tracking-widest ${(row.entryType?.toLowerCase() === "credit")
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                            }`}>
                            {row.entryType || "N/A"}
                          </span>
                        </TableCell>

                        <TableCell className="text-xs font-bold text-foreground">
                          {row.remarks || row.description || "N/A"}
                        </TableCell>

                        <TableCell className="text-xs font-bold text-muted-foreground uppercase">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] tracking-widest ${(row.status?.toLowerCase() === "approved")
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                            }`}>
                            {row.status || "N/A"}
                          </span>
                        </TableCell>

                        <TableCell className="text-xs font-black text-foreground">
                          $ {row.amount || 0}
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
                        No weekly profit bonus record found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
          {totalPages > 0 && (
            <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest order-2 sm:order-1">
                Page {currentPage} of {totalPages}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-1.5 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => fetchData(1)}
                  className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  First
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => fetchData(currentPage - 1)}
                  className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                >
                  Prev
                </Button>

                <div className="flex items-center gap-1 mx-1">
                  {(() => {
                    const pages = [];
                    if (totalPages > 0) {
                      pages.push(currentPage);
                      if (currentPage < totalPages) {
                        pages.push(currentPage + 1);
                        if (currentPage + 1 < totalPages) {
                          pages.push("...");
                        }
                      }
                    }

                    return pages.map((page, idx) => (
                      <React.Fragment key={idx}>
                        {page === "..." ? (
                          <span className="w-8 h-8 flex items-center justify-center text-muted-foreground">...</span>
                        ) : (
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            disabled={loading}
                            onClick={() => fetchData(page as number)}
                            className={`h-8 w-8 text-[11px] font-bold transition-all ${
                              currentPage === page 
                               ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-primary" 
                               : "hover:bg-primary/5"
                            }`}
                          >
                            {page}
                          </Button>
                        )}
                      </React.Fragment>
                    ));
                  })()}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => fetchData(currentPage + 1)}
                  className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                >
                  Next
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => fetchData(totalPages)}
                  className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
