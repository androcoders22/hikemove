"use client";

import { PageHeader } from "@/components/page-header";
import { Users, UserCheck, ArrowUpCircle, UserPlus, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminDashboardAPI } from "@/lib/api/admin";

export default function AdminDashboardPage() {
  const [dashboardStats, setDashboardStats] = useState({
    allMembersCount: 0,
    activeMembersCount: 0,
    totalPackagesAmount: 0,
    totalPaidAmountThroughCommission: 0,
    todayJoinedMembersCount: 0,
    loading: true,
  });
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await getAdminDashboardAPI();
      const payload = res.data?.data || res.data;
      if (payload) {
        setDashboardStats({
          allMembersCount: payload.allMembersCount ?? 0,
          activeMembersCount: payload.activeMembersCount ?? 0,
          totalPackagesAmount: payload.totalPackagesAmount ?? 0,
          totalPaidAmountThroughCommission:
            payload.totalPaidAmountThroughCommission ?? 0,
          todayJoinedMembersCount: payload.todayJoinedMembersCount ?? 0,
          loading: false,
        });
      } else {
        setDashboardStats((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error("Failed to fetch admin dashboard stats", err);
      setDashboardStats((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const stats = [
    {
      title: "All Members",
      value: dashboardStats.loading
        ? "..."
        : dashboardStats.allMembersCount.toLocaleString(),
      // change: "+12.5%",
      isPositive: true,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      description: "Total registered users",
      href: "/admin/member-options/all-members",
    },
    {
      title: "Active Members",
      value: dashboardStats.loading
        ? "..."
        : dashboardStats.activeMembersCount.toLocaleString(),
      // change: "+8.2%",
      isPositive: true,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      description: "Currently active users",
      href: "/admin/member-options/active-members",
    },
    {
      title: "Total Topup Amount",
      value: dashboardStats.loading
        ? "..."
        : formatCurrency(dashboardStats.totalPackagesAmount),
      // change: "+15.3%",
      isPositive: true,
      icon: ArrowUpCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      description: "Cumulative topups",
    },
    {
      title: "Today Joining",
      value: dashboardStats.loading
        ? "..."
        : dashboardStats.todayJoinedMembersCount.toLocaleString(),
      // change: "-2.4%",
      isPositive: false,
      icon: UserPlus,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      description: "New users today",
    },
    {
      title: "Paid Income",
      value: dashboardStats.loading
        ? "..."
        : formatCurrency(dashboardStats.totalPaidAmountThroughCommission),
      // change: "+5.7%",
      isPositive: true,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      description: "Total payouts issued",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <PageHeader
        title="Admin Dashboard"
        breadcrumbs={[{ title: "Admin", href: "#" }, { title: "Dashboard" }]}
      />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-400 mx-auto w-full">
        {/* Top Section with Title and Action */}
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
            System Overview 
            {/* <Badge variant="outline" className="ml-2 bg-background font-mono text-xs">v1.2.0</Badge> */}
          </h2>
          <p className="text-muted-foreground text-sm font-medium">Real-time platform statistics and performance metrics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {stats.map((stat) => {
            const Content = (
              <Card className="relative overflow-hidden border-none shadow-md bg-background transition-all hover:shadow-lg group h-full cursor-pointer">
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:scale-110 transition-transform ${stat.bgColor.replace('/10', '/30')}`} />
                
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor} transition-transform group-hover:rotate-6`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black tracking-tight">{stat.value}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      {/* <span className={`flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                        stat.isPositive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                      }`}>
                        {stat.isPositive ? <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" /> : <ArrowDownRight className="h-2.5 w-2.5 mr-0.5" />}
                      </span> */}
                      {/* <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-tighter">vs last month</span> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );

            return stat.href ? (
              <Link href={stat.href} key={stat.title}>
                {Content}
              </Link>
            ) : (
              <div key={stat.title}>
                {Content}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
