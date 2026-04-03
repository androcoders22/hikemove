"use client";

import React, { useMemo, useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
  WalletCards,
  Search,
  CheckCircle2,
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
import { Input } from "@/components/ui/input";
import { getLedgerMeAPI } from "@/lib/api/ledger";
import { getWalletHistoryAPI } from "@/lib/api/wallet";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowDownLeft, 
  ArrowUpRight as ArrowUpRightIcon
} from "lucide-react";

interface LedgerRow {
  _id: string;
  amount: number;
  ledgerType: string;
  entryType: string;
  remarks?: string;
  createdAt: string;
  status?: string;
}

export default function WalletHistory() {
  const [historyData, setHistoryData] = useState<LedgerRow[]>([]);
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const res = await getWalletHistoryAPI();
        if (res.data?.status && res.data?.data) {
          setWalletInfo(res.data.data);
        }
      } catch (err) {
        console.error("Wallet fetch error:", err);
      }
    };
    fetchWalletDetails();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getLedgerMeAPI();
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
  }, []);

  const filteredData = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return historyData;

    return historyData.filter((row) => {
      const remarks = (row.remarks || "").toLowerCase();
      const type = (row.ledgerType || "").toLowerCase();
      const entryType = (row.entryType || "").toLowerCase();
      const status = (row.status || "").toLowerCase();
      return (
        remarks.includes(query) ||
        type.includes(query) ||
        entryType.includes(query) ||
        status.includes(query) ||
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
        {/* Wallet Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Card className="border-[#dce8d3] bg-white shadow-sm overflow-hidden group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a927e]">Deposit Balance</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-[#5c634f]">$ {walletInfo?.depositBalance || 0}</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20 group-hover:scale-110 transition-transform">
                  <WalletCards className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-100 bg-white shadow-sm overflow-hidden group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600/70">Income Balance</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-[#5c634f]">$ {walletInfo?.incomeBalance || 0}</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 ring-1 ring-amber-100 group-hover:scale-110 transition-transform">
                  <ArrowUpRightIcon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="border-emerald-100 bg-white shadow-sm overflow-hidden group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70">Total Earned</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-[#5c634f]">$ {(walletInfo?.totalBonus || 0) + (walletInfo?.weeklyProfit || 0)}</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 ring-1 ring-emerald-100 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* <Card className="border-[#dce8d3] bg-white shadow-sm overflow-hidden group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a927e]">Total Withdrawal</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-[#5c634f]">$ {walletInfo?.totalWithdrawal || 0}</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-[#fafcf8] flex items-center justify-center text-[#5c634f] ring-1 ring-[#dce8d3] group-hover:scale-110 transition-transform">
                  <ArrowDownLeft className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

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

                        <TableCell className="text-xs font-bold text-foreground max-w-75">
                          {row.remarks || "N/A"}
                        </TableCell>

                        <TableCell className="text-xs font-bold text-muted-foreground uppercase">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] tracking-widest ${(row.status?.toLowerCase() === "approved")
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-rose-500/10 text-rose-500"
                            }`}>
                            {row.status || "N/A"}
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
                        colSpan={7}
                        className="text-center py-8 text-sm text-muted-foreground"
                      >
                        No wallet history records found.
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
