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
import { toast } from "sonner";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

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
    weeklyIncome: Array<{ day: string; amount: number }>;
  };
}

const iconMap: Record<string, React.ElementType> = {
  "dollar-sign": DollarSign,
  users: Users,
  "user-plus": UserPlus,
  wallet: Wallet,
  award: Award,
};

import { PageHeader } from "@/components/page-header";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/dashboard.json")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      });
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

  const fullReferralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/member-signup/${(() => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr).memberId : "default";
    } catch (e) {
      return "default";
    }
  })()}`;

  return (
    <div className="flex flex-col selection:bg-primary/10 selection:text-primary">
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ title: "App", href: "#" }, { title: "Dashboard" }]}
      />

      {/* Referral Link & Actions Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-y border-border bg-muted/20">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight whitespace-nowrap">
            Referral link:
          </span>
          <div className="flex items-center bg-background border border-border px-2 py-0.5 rounded gap-2 min-w-0">
            <span className="text-[11px] font-mono text-foreground truncate select-all">
              {fullReferralLink}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5 text-muted-foreground hover:text-primary shrink-0"
              onClick={() => {
                navigator.clipboard.writeText(fullReferralLink);
                toast.success("Copied to clipboard");
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[10px] font-bold"
          >
            EXPORT
          </Button>
          <Button size="sm" className="h-7 text-[10px] font-bold px-3">
            SHARE
          </Button>
        </div>
      </div>

      <div className="flex flex-col">
        {/* Large Data Graph Section */}
        <div className="w-full bg-muted/30 border-b border-border">
          <div className="p-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
                Total Profits
              </p>
              <h2 className="text-3xl font-black tracking-tight text-foreground">
                $1,224.75
              </h2>
            </div>
            <div className="flex gap-1">
              {["1D", "7D", "1M", "1Y", "ALL"].map((range) => (
                <button
                  key={range}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${range === "7D" ? "bg-background text-primary shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[280px] w-full px-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.charts.weeklyIncome}
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
                  dataKey="day"
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
          {data.stats.map((stat, idx) => {
            const Icon = iconMap[stat.icon] || DollarSign;
            return (
              <div
                key={stat.id}
                className={`p-4 group hover:bg-accent transition-colors border-r border-border last:border-r-0 ${idx >= 6 ? "hidden lg:block" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-1.5 rounded-md bg-background text-muted-foreground border border-border group-hover:text-primary group-hover:border-primary/30 transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-muted/20 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 truncate">
                  {stat.label}
                </p>
                <p className="text-lg font-black text-foreground leading-none">
                  {formatValue(stat)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
