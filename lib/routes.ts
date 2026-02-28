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
  History,
  Coins,
  Medal,
  Award,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const misPaths: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Tree View", url: "/tree-view", icon: Workflow },
      { title: "Edit Profile", url: "/edit-profile", icon: User },
      { title: "Deposit Activity", url: "/deposit-activity", icon: PiggyBank },
      { title: "Member Top Up", url: "/member-top-up", icon: ArrowUpCircle },
    ],
  },
  {
    title: "My Team",
    items: [
      { title: "My Sponsor", url: "/team/sponsor", icon: User },
      { title: "My Team", url: "/team/list", icon: Users },
      { title: "Level Wise Team", url: "/team/level-wise", icon: Workflow },
    ],
  },
  {
    title: "My Bonus",
    items: [
      { title: "Sponsor Bonus", url: "/bonus/sponsor", icon: Gift },
      { title: "Team Level Bonus", url: "/bonus/team-level", icon: Users },
      {
        title: "Weekly Profit Bonus",
        url: "/bonus/weekly-profit",
        icon: Coins,
      },
      {
        title: "Level Profit Bonus",
        url: "/bonus/level-profit",
        icon: PiggyBank,
      },
      { title: "Reward Bonus", url: "/bonus/reward", icon: Award },
      { title: "Reward List", url: "/bonus/reward-list", icon: Medal },
    ],
  },
  {
    title: "Withdrawal Wallet",
    items: [
      { title: "Withdrawal", url: "/withdrawal", icon: Wallet },
      {
        title: "Wallet History",
        url: "/withdrawal/wallet-history",
        icon: History,
      },
    ],
  },
  {
    title: "Support",
    items: [{ title: "Ticket System", url: "/tickets", icon: Ticket }],
  },
];
