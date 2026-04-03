import {
  LucideIcon,
  LayoutDashboard,
  FileText,
  User,
  UserCheck,
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
  Briefcase,
  Crosshair,
  Settings,
  KeyRound,
  CircleDollarSign,
  LogOut,
  LayoutGrid,
  Package,
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

export const adminPaths: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
      { title: "Tree View", url: "/admin/tree-view", icon: Workflow },
    ],
  },
  {
    title: "Withdrawal History",
    items: [
      {
        title: "Withdrawal Request List",
        url: "/admin/withdrawal-history/request",
        icon: Wallet,
      },
      {
        title: "Withdrawal Approve List",
        url: "/admin/withdrawal-history/approve",
        icon: Wallet,
      },
    ],
  },
  {
    title: "Member Options",
    items: [
      {
        title: "All Members",
        url: "/admin/member-options/all-members",
        icon: Users,
      },
      {
        title: "Active Members",
        url: "/admin/member-options/active-members",
        icon: UserCheck,
      },
      {
        title: "Member Direct",
        url: "/admin/member-options/direct",
        icon: User,
      },
      {
        title: "Member Downline",
        url: "/admin/member-options/downline",
        icon: Users,
      },
      {
        title: "View Profile",
        url: "/admin/member-options/change-profile",
        icon: Crosshair,
      },
      {
        title: "Wallet Update",
        url: "/admin/member-options/wallet-update",
        icon: Wallet,
      },
      {
        title: "Wallet History",
        url: "/admin/member-options/wallet-history",
        icon: History,
      },
      {
        title: "Manual Registration",
        url: "/admin/member-options/manual-registration",
        icon: FileText,
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        title: "Income Check",
        url: "/admin/payments/income-check",
        icon: LayoutGrid,
      },
      {
        title: "Fund Requests",
        url: "/admin/payments/fund-request",
        icon: PiggyBank,
      },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Tickets System", url: "/admin/support-tickets", icon: Ticket },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "App Setting",
        url: "/admin/configuration/coin-setting",
        icon: CircleDollarSign,
      },
    ],
  },
];

export const memberPaths: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Tree View", url: "/tree-view", icon: Workflow },
      { title: "View Profile", url: "/edit-profile", icon: User },
      { title: "Deposit Activity", url: "/deposit-activity", icon: PiggyBank },
      { title: "Member Top Up", url: "/member-top-up", icon: ArrowUpCircle },
      { title: "Member Package", url: "/member-package", icon: Package },
    ],
  },
  {
    title: "My Team",
    items: [
      { title: "My Sponsors", url: "/team/sponsor", icon: User },
      { title: "Level Wise Team", url: "/team/list", icon: Users },
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
      { title: "Withhdrawal Request", url: "/member-request", icon: Wallet },
      // { title: "Withdrawal", url: "/withdrawal", icon: Wallet },
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
