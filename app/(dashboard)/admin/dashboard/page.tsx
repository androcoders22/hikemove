"use client";

import { PageHeader } from "@/components/page-header";
import { Users, UserCheck, ArrowUpCircle, UserPlus, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllMembersAPI, getActiveMembersAPI } from "@/lib/api/admin";
import { getMemberStatus } from "@/lib/utils/member-status";

export default function AdminDashboardPage() {
  const [memberStats, setMemberStats] = useState({
    all: 0,
    active: 0,
    recentMembers: [] as any[],
    loading: true
  });

  const fetchStats = async () => {
    try {
      const [allRes, activeRes] = await Promise.all([
        getAllMembersAPI(),
        getActiveMembersAPI()
      ]);
      
      const allMembers = allRes.data?.data || allRes.data || [];
      const activeMembersRaw = activeRes.data?.data || activeRes.data || [];
      
      // Use the same logic as the active-members page for consistency
      const activeOnly = activeMembersRaw.filter((m: any) => getMemberStatus(m) === "active");

      // Sort by creation date if available, or just take last 5 from the array
      // Reversing to get the newest first (assuming API returns chronological)
      const recent = [...allMembers].reverse().slice(0, 5);

      setMemberStats({
        all: allMembers.length,
        active: activeOnly.length,
        recentMembers: recent,
        loading: false
      });
    } catch (err) {
      console.error("Failed to fetch admin dashboard stats", err);
      setMemberStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh every 10 minutes (600,000 ms)
    const interval = setInterval(fetchStats, 600000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: "All Members",
      value: memberStats.loading ? "..." : memberStats.all.toLocaleString(),
      change: "+12.5%",
      isPositive: true,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      description: "Total registered users",
      href: "/admin/member-options/all-members",
    },
    {
      title: "Active Members",
      value: memberStats.loading ? "..." : memberStats.active.toLocaleString(),
      change: "+8.2%",
      isPositive: true,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      description: "Currently active users",
      href: "/admin/member-options/active-members",
    },
    {
      title: "Total Topup Amount",
      value: "$45,231.00",
      change: "+15.3%",
      isPositive: true,
      icon: ArrowUpCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      description: "Cumulative topups",
    },
    {
      title: "Today Joining",
      value: "48",
      change: "-2.4%",
      isPositive: false,
      icon: UserPlus,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      description: "New users today",
    },
    {
      title: "Paid Income",
      value: "$12,450.00",
      change: "+5.7%",
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
            <Badge variant="outline" className="ml-2 bg-background font-mono text-xs">v1.2.0</Badge>
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
                      <span className={`flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                        stat.isPositive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                      }`}>
                        {stat.isPositive ? <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" /> : <ArrowDownRight className="h-2.5 w-2.5 mr-0.5" />}
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-tighter">vs last month</span>
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

        {/* Detailed Sections (Placeholders for real charts/tables) */}
        <div className="grid lg:grid-cols-7 gap-6">
          <Card className="lg:col-span-3 border-none shadow-md overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Live system events and joinings</CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Live</Badge>
            </CardHeader>
            <CardContent className="p-0 border-t border-border">
              <div className="divide-y divide-border">
                {memberStats.loading ? (
                    <div className="p-10 text-center text-muted-foreground flex flex-col items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-xs font-medium">Syncing live events...</span>
                    </div>
                ) : memberStats.recentMembers.length === 0 ? (
                    <div className="p-10 text-center text-muted-foreground italic text-xs">
                        No recent activity found.
                    </div>
                ) : (
                    memberStats.recentMembers.map((member, i) => (
                    <div key={member._id || i} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                        {/* <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                        {member.memberId?.slice(-2) || i + 1}
                        </div> */}
                        <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{member.fullName || "New Member"}</p>
                        <p className="text-xs text-muted-foreground truncate">
                            ID: <span className="text-primary font-medium">{member.memberId}</span> • {member.phone || "No Mobile"}
                        </p>
                        </div>
                        <div className="text-right">
                        <Badge variant="secondary" className="text-[9px] font-black uppercase px-1.5 py-0">
                            {member.status || "Joined"}
                        </Badge>
                        </div>
                    </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
