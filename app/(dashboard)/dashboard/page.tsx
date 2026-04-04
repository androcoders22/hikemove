"use client";

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  Users,
  UserPlus,
  Wallet,
  Copy,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import Link from "next/link";

interface DashboardData {
  referralLink: string;
  stats: Array<{
    id: string;
    label: string;
    value: string | number;
    type: string;
    icon: string;
    color: string;
  }>;
  charts: {
    weeklyIncome: Array<{ week: string; amount: number }>;
  };
  totalBalance?: number;
  total_balance?: number;
}

const iconMap: Record<string, React.ElementType> = {
  "dollar-sign": DollarSign,
  users: Users,
  "user-plus": UserPlus,
  wallet: Wallet,
  award: Award,
};

import { PageHeader } from "@/components/page-header";
import { getMemberDashboardAPI } from "@/lib/api/dashboard";
import { getWalletAPI } from "@/lib/api/wallet";
import { getWithdrawalHistoryAPI } from "@/lib/api/withdrawal";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [referralLink, setReferralLink] = useState("");
  const [user, setUser] = useState<{ fullName?: string; memberId?: string } | null>(null);

  const buildStatsFromPayload = (payload: any) => {
    if (!payload) return [];

    const stats = [
      {
        id: "total-package-amount",
        label: "Package Amount",
        value: payload.totalPackageAmount ?? 0,
        type: "currency",
        icon: "dollar-sign",
        color: "primary",
      },
      {
        id: "my-sponsor",
        label: "My Sponsor",
        value: payload.mySponsor ?? 0,
        type: "number",
        icon: "users",
        color: "primary",
      },
      {
        id: "my-team",
        label: "My Team",
        value: payload.myTeam ?? 0,
        type: "number",
        icon: "users",
        color: "primary",
      },
      {
        id: "sponsor-bonus",
        label: "Sponsor Bonus",
        value: payload.sponsorBonus ?? 0,
        type: "currency",
        icon: "award",
        color: "primary",
      },
      {
        id: "team-level-bonus",
        label: "Team Level Bonus",
        value: payload.teamLevelBonus ?? 0,
        type: "currency",
        icon: "award",
        color: "primary",
      },
      {
        id: "weekly-income-bonus",
        label: "Weekly Income",
        value: payload.weeklyIncomeBonus ?? 0,
        type: "currency",
        icon: "award",
        color: "primary",
      },
      {
        id: "level-profit-bonus",
        label: "Level Profit",
        value: payload.levelProfitBonus ?? 0,
        type: "currency",
        icon: "award",
        color: "primary",
      },
      {
        id: "total-bonus",
        label: "Total Bonus",
        value: payload.totalBonus ?? 0,
        type: "currency",
        icon: "award",
        color: "primary",
      },
      {
        id: "paid-bonus",
        label: "Paid Bonus",
        value: payload.paidBonus ?? 0,
        type: "currency",
        icon: "dollar-sign",
        color: "primary",
      },
      {
        id: "deposit-balance",
        label: "Credit Wallet",
        value: payload.depositBalance ?? 0,
        type: "currency",
        icon: "wallet",
        color: "primary",
      },
      {
        id: "income-balance",
        label: "Income Wallet",
        value: payload.incomeBalance ?? 0,
        type: "currency",
        icon: "wallet",
        color: "primary",
      },
    ];

    return stats;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, walletRes, withdrawalRes] = await Promise.all([
          getMemberDashboardAPI(),
          getWalletAPI().catch(() => null),
          getWithdrawalHistoryAPI().catch(() => null),
        ]);

        const dashboardPayload = dashboardRes?.data?.data ?? dashboardRes?.data;
        if (!dashboardPayload) {
          throw new Error("Dashboard payload missing");
        }

        // Calculate Paid Bonus from withdrawal history if not provided by dashboard API
        let paidBonus = dashboardPayload.paidBonus ?? 0;
        if (withdrawalRes?.data?.status && Array.isArray(withdrawalRes.data.data)) {
          paidBonus = withdrawalRes.data.data
            .filter((w: any) =>
              w.status?.toLowerCase() === "paid" ||
              w.status?.toLowerCase() === "approved"
            )
            .reduce((sum: number, w: any) => sum + (Number(w.amount) || 0), 0);
        }

        let finalData = {
          ...dashboardPayload,
          paidBonus: paidBonus
        };

        const wallet = walletRes?.data?.data;

        if (walletRes?.data?.status && wallet && Array.isArray(finalData.stats)) {
          finalData = {
            ...finalData,
            stats: finalData.stats.map((stat: any) => {
              if (stat.id === "credit-wallet") {
                return { ...stat, value: wallet.depositBalance ?? 0 };
              }
              if (stat.id === "income-wallet") {
                return { ...stat, value: wallet.incomeBalance ?? 0 };
              }
              return stat;
            }),
            totalBalance:
              finalData.totalBalance ??
              finalData.total_balance ??
              wallet.depositBalance ??
              0,
          };
        }

        if (finalData?.referralLink) {
          setReferralLink(finalData.referralLink);
        }

        const weeklyIncomeHistory = Array.isArray(finalData?.weeklyIncomeHistory)
          ? finalData.weeklyIncomeHistory
          : [];

        const normalizedWeeklyIncome = Array.isArray(finalData?.charts?.weeklyIncome)
          ? finalData.charts.weeklyIncome.map((item: any) => ({
            week: item.week || item.day || "",
            amount: item.amount,
          }))
          : weeklyIncomeHistory.map((amount: number, index: number) => ({
            week: `W${index + 1}`,
            amount,
          }));

        const normalizedData: DashboardData = {
          referralLink: finalData?.referralLink ?? "",
          stats: Array.isArray(finalData?.stats)
            ? finalData.stats
            : buildStatsFromPayload(finalData),
          charts: {
            weeklyIncome: normalizedWeeklyIncome,
          },
          totalBalance:
            finalData?.totalBalance ??
            finalData?.total_balance ??
            finalData?.totalBonus ??
            finalData?.incomeBalance ??
            finalData?.depositBalance,
          total_balance: finalData?.total_balance,
        };

        setData(normalizedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();

    // Build referral link on the client (localStorage only available after mount)
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser({
          fullName: userData.fullName || userData.full_name || userData.name || "Member",
          memberId: userData.memberId || userData.member_id || localStorage.getItem("memberId") || "N/A"
        });
      }

      const directId = localStorage.getItem("memberId");
      if (directId) {
        setReferralLink(`${window.location.origin}/member-signup/${directId}`);
      } else if (userStr) {
        const userData = JSON.parse(userStr);
        const memberId = userData.memberId || userData.member_id || userData.id || "";
        if (memberId) {
          setReferralLink(`${window.location.origin}/member-signup/${memberId}`);
        }
      }
    } catch (e) { }
  }, []);



  if (loading || !data) return null;

  const formatValue = (stat: any) => {
    if (stat.type === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(stat.value);
    }
    return stat.value;
  };

  const statLinks: Record<string, string> = {
    "total-package-amount": "/member-package",
    "my-sponsor": "/team/sponsor",
    "my-team": "/team/level-wise",
    "sponsor-bonus": "/bonus/sponsor",
    "team-level-bonus": "/bonus/team-level",
    "weekly-income-bonus": "/bonus/weekly-profit",
    "level-profit-bonus": "/bonus/level-profit",
    "total-bonus": "/withdrawal/wallet-history",
    "paid-bonus": "/member-request",
    "deposit-balance": "/withdrawal/wallet-history",
    "income-balance": "/member-request",
  };


  return (
    <div className="flex flex-col min-h-screen w-full overflow-y-auto overflow-x-hidden bg-background pb-8 selection:bg-primary/10 selection:text-primary">
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ title: "App", href: "#" }, { title: "Dashboard" }]}
      />

      {/* Member Identity Card */}
      <div className="px-4 py-4 bg-background border-b border-border">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-foreground flex items-center justify-center text-background shadow-lg">
            <span className="text-xl font-black">
              {user?.fullName?.charAt(0) || "M"}
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight text-foreground leading-tight lowercase first-letter:capitalize">
              {user?.fullName || "Member Name"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                Member ID: {user?.memberId || "---"}
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 border-y border-border bg-muted/20 gap-2 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3 overflow-hidden min-w-0 flex-1">
          <span className="text-[11px] max-w-[200px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Referral link:
          </span>
          <div className="group relative flex items-center bg-background border border-border px-3 py-1.5 sm:py-1 rounded gap-2 min-w-0 flex-1 sm:flex-initial overflow-hidden transition-all hover:border-primary/50">
            {/* Professional Shimmer Animation - Continuous */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

            <span className="relative z-10 text-[13px] font-mono font-black text-foreground truncate select-all">
              {referralLink}
            </span>

            <style jsx global>{`
              @keyframes shimmer {
                100% {
                  transform: translateX(100%);
                }
              }
            `}</style>
            <Button
              size="icon"
              variant="ghost"
              className="relative z-10 h-5 w-5 text-muted-foreground hover:text-primary shrink-0 transition-transform active:scale-95"
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                toast.success("Referral link copied!");
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {/* <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[10px] font-bold flex-1 sm:flex-initial"
          >
            EXPORT
          </Button>
          <Button size="sm" className="h-7 text-[10px] font-bold px-3 flex-1 sm:flex-initial">
            SHARE
          </Button>
        </div> */}
      </div>

      <div className="flex flex-col">
        {/* Large Data Graph Section */}
        <div className="w-full bg-muted/30 border-b border-border">
          <div className="p-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
                Total Profits
              </p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                ${(data as any).totalBalance ? (data as any).totalBalance.toLocaleString() : "0.00"}
              </h2>
            </div>
            <div className="flex gap-1 flex-wrap">
              {["Weekly Income"].map((range) => (
                <button
                  key={range}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${range === "Weekly Income" ? "bg-background text-primary shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-50 sm:h-70 w-full px-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.charts?.weeklyIncome ?? []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
                <Tooltip
                  cursor={{ stroke: "var(--primary)", strokeWidth: 1 }}
                  contentStyle={{
                    borderRadius: "4px",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-md)",
                    backgroundColor: "var(--background)",
                    fontSize: "11px",
                    fontWeight: "bold",
                    padding: "8px 12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#mainGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dense Stats Grid (No Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 border-b border-border">
          {data.stats.map((stat) => {
            const Icon = iconMap[stat.icon] || DollarSign;
            const href = statLinks[stat.id];
            return (
              <Link
                key={stat.id}
                href={href || "#"}
                className="p-3 sm:p-4 group hover:bg-accent transition-colors border-r border-border last:border-r-0"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="p-1.5 rounded-md bg-background text-muted-foreground border border-border group-hover:text-primary group-hover:border-primary/30 transition-colors">
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-muted/20 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 truncate">
                  {stat.label}
                </p>
                <p className="text-base sm:text-lg font-black text-foreground leading-none">
                  {formatValue(stat)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
