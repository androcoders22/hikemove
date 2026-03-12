"use client";

import React, { useMemo, useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { TrendingUp, Search, Filter, Calendar, Layers, Loader2 } from "lucide-react";
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
import { getLevelProfitBonusAPI } from "@/lib/api/ledger";

interface LedgerRow {
  _id: string;
  amount: number;
  type: string;
  description?: string;
  remark?: string;
  createdAt: string;
  transactionType?: string;
  status?: string;
}

export default function LevelProfitBonus() {
  const [bonusData, setBonusData] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getLevelProfitBonusAPI();
        if (response.data?.status && Array.isArray(response.data.data)) {
          setBonusData(response.data.data);
        } else {
          setBonusData([]);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return bonusData;

    return bonusData.filter((row) => {
      const desc = (row.description || row.remark || "").toLowerCase();
      return (
        desc.includes(query) ||
        row.amount.toString().includes(query) ||
        row.createdAt.toLowerCase().includes(query)
      );
    });
  }, [bonusData, searchTerm]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        title="Level Profit Bonus"
        breadcrumbs={[
          { title: "My Bonus", href: "#" },
          { title: "Level Profit Bonus" },
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
              <TrendingUp className="h-4 w-4 text-primary" />
              Level Profit Bonus History
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

          <div className="overflow-x-auto min-h-[100px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p className="text-sm font-bold">Loading records...</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest w-[80px]">
                      Sr. No.
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
                      Description
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
                      Amount
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
                      Status
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
                          {idx + 1}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-foreground">
                          {row.description || row.remark || "N/A"}
                        </TableCell>
                        <TableCell className="text-xs font-black text-emerald-600">
                          $ {row.amount || 0}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase">
                            {row.status || "Completed"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-xs font-medium text-muted-foreground">
                          <div className="flex items-center justify-end gap-2">
                            <Calendar className="h-3 w-3 opacity-50" />
                            {formatDate(row.createdAt)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-6 text-sm text-muted-foreground"
                      >
                        No level profit bonus record found.
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