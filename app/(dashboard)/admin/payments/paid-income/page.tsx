"use client";

import React, { useMemo, useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Gift, Search, Loader2 } from "lucide-react";
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
import { getPaidIncomeAPI } from "@/lib/api/ledger";

interface LedgerRow {
  _id: string;
  member?: {
    memberId?: string;
  } | string;
  amount: number;
  ledgerType: string;
  entryType: string;
  description?: string;
  remarks?: string;
  createdAt: string;
  status?: string;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  pageSize: 15,
  totalItems: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

export default function PaidIncomePage() {
  const [ledgerData, setLedgerData] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] =
    useState<PaginationMeta>(DEFAULT_PAGINATION);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getPaidIncomeAPI(currentPage, DEFAULT_PAGINATION.pageSize);
        if (response.data?.status && Array.isArray(response.data.data)) {
          setLedgerData(response.data.data);
        } else {
          setLedgerData([]);
        }

        const apiMeta = response.data?.metaData;
        setPagination({
          page: Number(apiMeta?.page) || currentPage,
          pageSize: Number(apiMeta?.pageSize) || DEFAULT_PAGINATION.pageSize,
          totalItems: Number(apiMeta?.totalItems) || 0,
          totalPages: Math.max(1, Number(apiMeta?.totalPages) || 1),
          hasNextPage: Boolean(apiMeta?.hasNextPage),
          hasPreviousPage: Boolean(apiMeta?.hasPreviousPage),
        });
      } catch (err: any) {
        setError(err.message || "An error occurred");
        setLedgerData([]);
        setPagination(DEFAULT_PAGINATION);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return ledgerData;

    return ledgerData.filter((row) => {
      const desc = (row.description || row.remarks || "").toLowerCase();
      const lType = (row.ledgerType || "").toLowerCase();
      const memberId =
        typeof row.member === "string"
          ? row.member.toLowerCase()
          : (row.member?.memberId || "").toLowerCase();

      return (
        desc.includes(query) ||
        lType.includes(query) ||
        memberId.includes(query) ||
        row.amount.toString().includes(query)
      );
    });
  }, [ledgerData, searchTerm]);

  const totalPages = Math.max(1, pagination.totalPages || 1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
        title="Paid Income"
        breadcrumbs={[
          { title: "Payments", href: "#" },
          { title: "Paid Income" },
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
              <Gift className="h-4 w-4 text-primary" />
              Paid Income History
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full md:w-56">
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
                          {(pagination.page - 1) * pagination.pageSize + idx + 1}
                        </TableCell>

                        <TableCell className="text-xs font-black text-primary tracking-tight">
                          {row.ledgerType || "N/A"}
                        </TableCell>

                        <TableCell className="text-xs font-bold text-muted-foreground uppercase">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] tracking-widest ${(row.entryType?.toLowerCase() === "credit")
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-rose-500/10 text-rose-500"
                              }`}
                          >
                            {row.entryType || "N/A"}
                          </span>
                        </TableCell>

                        <TableCell className="text-xs font-bold text-foreground">
                          {row.remarks || row.description || "N/A"}
                        </TableCell>

                        <TableCell className="text-xs font-bold text-muted-foreground uppercase">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] tracking-widest ${(row.status?.toLowerCase() === "approved")
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-rose-500/10 text-rose-500"
                              }`}
                          >
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
                        className="text-center py-8 text-sm text-muted-foreground"
                      >
                        No paid income records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* {!loading && totalPages > 0 && (
            <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest order-2 sm:order-1">
                Page {currentPage} of {totalPages}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-1.5 order-1 sm:order-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => setCurrentPage(1)}
                  className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                >
                  First
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                            type="button"
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            disabled={loading}
                            onClick={() => setCurrentPage(page as number)}
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
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                >
                  Next
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages || loading}
                  onClick={() => setCurrentPage(totalPages)}
                  className="h-8 px-2 text-[10px] font-black uppercase tracking-tighter"
                >
                  Last
                </Button>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}