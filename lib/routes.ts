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
  Briefcase,
  Crosshair,
  Settings,
  KeyRound,
  CircleDollarSign,
  LogOut,
  LayoutGrid,
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
    ],
  },
  {
    title: "Transaction History",
    items: [
      {
        title: "Transaction Request List",
        url: "/admin/transaction-history/request",
        icon: Briefcase,
      },
      {
        title: "Transaction Approve List",
        url: "/admin/transaction-history/approve",
        icon: Briefcase,
      },
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
        title: "Change Profile",
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
    ],
  },
  {
    title: "Support",
    items: [
      { title: "Ticket System", url: "/admin/ticket-system", icon: KeyRound },
    ],
  },
  {
    title: "Settings",
    items: [
      { title: "Popup setting", url: "/admin/settings/popup", icon: Settings },
      { title: "News upload", url: "/admin/settings/news", icon: FileText },
      { title: "Pillar image", url: "/admin/settings/pillar", icon: Settings },
      { title: "Contact list", url: "/admin/settings/contact", icon: Users },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Change Password",
        url: "/admin/change-password",
        icon: KeyRound,
      },
      {
        title: "Coin Setting",
        url: "/admin/coin-setting",
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
