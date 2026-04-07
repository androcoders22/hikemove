"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { getMemberMeAPI } from "@/lib/api/member";

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
        const [dashboardRes, walletRes, withdrawalRes, memberRes] = await Promise.all([
          getMemberDashboardAPI(),
          getWalletAPI().catch(() => null),
          getWithdrawalHistoryAPI().catch(() => null),
          getMemberMeAPI().catch(() => null),
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

        // Set user info from /member/me API response dynamically
        const profileData = memberRes?.data?.data ?? memberRes?.data;
        if (profileData) {
          setUser({
            fullName: profileData.fullName || profileData.full_name || profileData.name || "Member",
            memberId: profileData.memberId || profileData.member_id || profileData._id || "---"
          });
        } else {
          // Fallback extraction
          const userData = finalData.user || finalData.member || finalData;
          if (userData.fullName || userData.memberId || userData.user_name) {
            setUser({
              fullName: userData.fullName || userData.full_name || userData.user_name || "Member Name",
              memberId: userData.memberId || userData.member_id || userData.id || userData._id || "ID-000000"
            });
          }
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
    return stat.value ?? 0;
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

      <div className="flex flex-col gap-0">
        {/* Identity Hub Card */}
        <div className="px-4 pt-5 pb-2">
          <div className="relative overflow-hidden rounded-2xl bg-foreground text-background shadow-lg border border-primary/20 group transition-all duration-300 hover:shadow-primary/15 hover:shadow-xl">
            {/* Theme-matched glow using primary token */}
            <div className="absolute top-0 right-0 w-72 h-40 bg-primary/25 rounded-full blur-[70px] -mr-20 -mt-14 group-hover:bg-primary/35 transition-colors duration-700 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-[50px] -ml-16 -mb-16 pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 sm:p-6">
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-5">
                {/* Avatar with theme ring */}
                <div className="relative shrink-0">
                  <div className="h-16 w-16 rounded-2xl bg-primary/15 border-2 border-primary/50 flex items-center justify-center shadow-inner">
                    <span className="text-2xl font-black text-primary tracking-tight">
                      {user?.fullName?.charAt(0)?.toUpperCase() || "M"}
                    </span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-foreground" />
                  </span>
                </div>

                {/* Name + ID */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                    Verified Partner
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-none text-background">
                    {user?.fullName || "Member Name"}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono font-bold text-background/70 bg-background/10 border border-background/15 px-2.5 py-0.5 rounded-md tracking-wider">
                      ID: {user?.memberId || "---"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-primary bg-primary/20 border border-primary/30 px-2.5 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block animate-pulse" />
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Referral Hub */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 ml-auto w-full sm:w-auto overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/10 border border-primary/20 backdrop-blur-sm">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary whitespace-nowrap">
                    Referral Link :
                  </span>
                </div>

                <div className="flex items-center gap-4 flex-1 bg-background/5 border border-white/10 rounded-xl pl-4 pr-1.5 py-1.5 backdrop-blur-md hover:border-primary/40 hover:bg-white/5 transition-all duration-300 min-w-0 sm:min-w-[320px]">
                  <span className="flex-1 text-[12px] font-mono font-bold text-background/90 truncate select-all tracking-tight" title={referralLink}>
                    {referralLink || "Generating link..."}
                  </span>
                  <Button
                    size="sm"
                    className="h-8 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-[10px] uppercase rounded-lg shadow-[0_4px_12px_rgba(var(--primary),0.3)] transition-transform active:scale-95 shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(referralLink);
                      toast.success("Referral link copied!");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Decorative Space */}
        <div className="h-4" />
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
                ${(data as any).totalBalance ?? 0}
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
