"use client";

import React, { useMemo, useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
  WalletCards,
  Search,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Loader2,
  Calendar,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLedgerAPI, LedgerType } from "@/lib/api/ledger";

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

export default function WalletHistory() {
  const [historyData, setHistoryData] = useState<LedgerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>(LedgerType.WITHDRAWAL);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getLedgerAPI(selectedType);
        if (response.data?.status && Array.isArray(response.data.data)) {
          setHistoryData(response.data.data);
        } else {
          setHistoryData([]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message?.[0] || err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedType]);

  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return historyData;

    return historyData.filter((row) => {
      const desc = (row.description || row.remark || "").toLowerCase();
      const type = (row.type || "").toLowerCase();
      const txnType = (row.transactionType || "").toLowerCase();
      return (
        desc.includes(query) ||
        type.includes(query) ||
        txnType.includes(query) ||
        row.amount.toString().includes(query)
      );
    });
  }, [historyData, searchTerm]);

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
        title="Wallet History"
        breadcrumbs={[
          { title: "Withdrawal Wallet", href: "#" },
          { title: "Wallet History" },
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
              <WalletCards className="h-4 w-4 text-primary" />
              Wallet Transaction Logs
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

              <div className="w-full md:w-56">
                <Select
                  value={selectedType}
                  onValueChange={(val) => setSelectedType(val)}
                >
                  <SelectTrigger className="h-8 text-xs font-bold w-full bg-background border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LedgerType).map(([key, value]) => (
                      <SelectItem key={value} value={value} className="text-xs font-bold uppercase tracking-widest">
                        {key.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                      Type
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
                      Description
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
                      Txn Type
                    </TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">
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
                          {idx + 1}
                        </TableCell>

                        <TableCell className="text-xs font-black text-primary uppercase tracking-tight">
                          {row.type?.replace(/([A-Z])/g, " $1").trim() || "N/A"}
                        </TableCell>

                        <TableCell className="text-xs font-medium text-slate-500 italic max-w-[300px]">
                          {row.description || row.remark || "N/A"}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`text-[10px] font-black uppercase tracking-tight px-2 py-0.5 rounded flex items-center gap-1 w-fit ${
                              row.transactionType?.toLowerCase() === "credit"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-rose-500/10 text-rose-600"
                            }`}
                          >
                            <ArrowUpRight
                              className={`h-3 w-3 ${
                                row.transactionType?.toLowerCase() === "credit"
                                  ? ""
                                  : "rotate-90"
                              }`}
                            />
                            {row.transactionType || "N/A"}
                          </span>
                        </TableCell>

                        <TableCell className="text-sm font-black text-foreground">
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
                        colSpan={6}
                        className="text-center py-8 text-sm text-muted-foreground"
                      >
                        No records found for the selected type.
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