export type Post = {
  id: string;
  title: string;
  content?: string;
  platform: "Instagram" | "Facebook" | "Twitter" | "LinkedIn";
  status: "Published" | "Scheduled" | "Draft";
  date: string;
  engagement: number;
  client?: string;
  media?: string[];
};

export type Client = {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  logo?: string;
  accounts: SocialAccount[];
  status: "Active" | "Inactive" | "Pending";
  dateAdded: string;
};

export type SocialAccount = {
  id: string;
  platform: "Instagram" | "Facebook" | "Twitter" | "LinkedIn";
  handle: string;
  url: string;
  followers: number;
  isConnected: boolean;
};

export type AnalyticsData = {
  period: string;
  engagement: number;
  impressions: number;
  clicks: number;
  followers: number;
};

export type UserRole = "admin" | "manager" | "team_member";

export type SubscriptionPlan = "free" | "pro" | "business";