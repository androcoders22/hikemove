import {
  LucideIcon,
  LayoutDashboard,
  FileText,
  User,
  PiggyBank,
  ArrowUpCircle,
  Users,
  Gift,
  Wallet,
  Ticket,
  Workflow,
} from "lucide-react";

export interface Paths {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
}

export interface NavItem extends Paths {
  items?: Paths[];
}

export const misPaths: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tree View",
    url: "/tree-view",
    icon: Workflow,
  },
  // {
  //   title: "Business Plan",
  //   url: "/business-plan",
  //   icon: FileText,
  // },
  {
    title: "Edit Profile",
    url: "/edit-profile",
    icon: User,
  },
  {
    title: "Deposit Activity",
    url: "/deposit-activity",
    icon: PiggyBank,
  },
  {
    title: "Member Top Up",
    url: "/member-top-up",
    icon: ArrowUpCircle,
  },
  {
    title: "My Team",
    url: "#",
    icon: Users,
    items: [
      { title: "My Sponsor", url: "/team/sponsor" },
      { title: "My Team", url: "/team/list" },
      { title: "Level Wise Team", url: "/team/level-wise" },
    ],
  },
  {
    title: "My Bonus",
    url: "#",
    icon: Gift,
    items: [
      { title: "Sponsor Bonus", url: "/bonus/sponsor" },
      { title: "Team Level Bonus", url: "/bonus/team-level" },
      { title: "Weekly Profit Bonus", url: "/bonus/weekly-profit" },
      { title: "Level Profit Bonus", url: "/bonus/level-profit" },
      { title: "Reward Bonus", url: "/bonus/reward" },
      { title: "Reward List", url: "/bonus/reward-list" },
    ],
  },
  {
    title: "Withdrawal Wallet",
    url: "#",
    icon: Wallet,
    items: [
      { title: "Withdrawal Request", url: "/withdrawal/request" },
      { title: "Withdrawal History", url: "/withdrawal/history" },
      { title: "Wallet History", url: "/withdrawal/wallet-history" },
    ],
  },
  {
    title: "Ticket System",
    url: "/tickets",
    icon: Ticket,
  },
];
