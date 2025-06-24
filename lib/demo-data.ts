import { Post, Client, AnalyticsData } from "./types";

// Recent posts for dashboard
export const recentPosts: Post[] = [
  {
    id: "post-1",
    title: "New Product Announcement",
    platform: "Instagram",
    status: "Published",
    date: "2025-04-10",
    engagement: 342,
    client: "TechCorp",
  },
  {
    id: "post-2",
    title: "Summer Sale Promotion",
    platform: "Facebook",
    status: "Scheduled",
    date: "2025-04-15",
    engagement: 0,
    client: "FashionStyle",
  },
  {
    id: "post-3",
    title: "Industry News Update",
    platform: "LinkedIn",
    status: "Draft",
    date: "2025-04-18",
    engagement: 0,
    client: "ConsultPro",
  },
  {
    id: "post-4",
    title: "Customer Testimonial",
    platform: "Twitter",
    status: "Published",
    date: "2025-04-08",
    engagement: 128,
    client: "HomeServices",
  },
  {
    id: "post-5",
    title: "Behind the Scenes",
    platform: "Instagram",
    status: "Published",
    date: "2025-04-05",
    engagement: 256,
    client: "FitnessFirst",
  },
  {
    id: "post-6",
    title: "Weekly Tip Series",
    platform: "LinkedIn",
    status: "Scheduled",
    date: "2025-04-16",
    engagement: 0,
    client: "EducateNow",
  },
  {
    id: "post-7",
    title: "Product Tutorial",
    platform: "Facebook",
    status: "Published",
    date: "2025-04-03",
    engagement: 189,
    client: "TechCorp",
  },
];

// Demo clients
export const demoClients: Client[] = [
  {
    id: "client-1",
    name: "TechCorp",
    website: "https://techcorp.example.com",
    industry: "Technology",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=TC&backgroundColor=4f46e5",
    accounts: [
      {
        id: "acc-1",
        platform: "Instagram",
        handle: "@techcorp",
        url: "https://instagram.com/techcorp",
        followers: 12500,
        isConnected: true,
      },
      {
        id: "acc-2",
        platform: "LinkedIn",
        handle: "TechCorp",
        url: "https://linkedin.com/company/techcorp",
        followers: 8300,
        isConnected: true,
      }
    ],
    status: "Active",
    dateAdded: "2024-01-15",
  },
  {
    id: "client-2",
    name: "FashionStyle",
    website: "https://fashionstyle.example.com",
    industry: "Fashion & Retail",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=FS&backgroundColor=f43f5e",
    accounts: [
      {
        id: "acc-3",
        platform: "Instagram",
        handle: "@fashionstyle",
        url: "https://instagram.com/fashionstyle",
        followers: 45200,
        isConnected: true,
      },
      {
        id: "acc-4",
        platform: "Facebook",
        handle: "FashionStyle",
        url: "https://facebook.com/fashionstyle",
        followers: 28700,
        isConnected: true,
      }
    ],
    status: "Active",
    dateAdded: "2024-02-03",
  },
  {
    id: "client-3",
    name: "ConsultPro",
    website: "https://consultpro.example.com",
    industry: "Consulting",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=CP&backgroundColor=14b8a6",
    accounts: [
      {
        id: "acc-5",
        platform: "LinkedIn",
        handle: "ConsultPro",
        url: "https://linkedin.com/company/consultpro",
        followers: 6800,
        isConnected: true,
      },
      {
        id: "acc-6",
        platform: "Twitter",
        handle: "@consultpro",
        url: "https://twitter.com/consultpro",
        followers: 3500,
        isConnected: true,
      }
    ],
    status: "Inactive",
    dateAdded: "2023-11-18",
  },
];

// Performance data for charts
export const performanceData = [
  {
    name: "Jan",
    instagram: 4000,
    facebook: 2400,
    twitter: 2400,
    linkedin: 1200,
  },
  {
    name: "Feb",
    instagram: 3000,
    facebook: 1398,
    twitter: 2210,
    linkedin: 1800,
  },
  {
    name: "Mar",
    instagram: 2000,
    facebook: 9800,
    twitter: 2290,
    linkedin: 2300,
  },
  {
    name: "Apr",
    instagram: 2780,
    facebook: 3908,
    twitter: 2000,
    linkedin: 2400,
  },
  {
    name: "May",
    instagram: 1890,
    facebook: 4800,
    twitter: 2181,
    linkedin: 2700,
  },
  {
    name: "Jun",
    instagram: 2390,
    facebook: 3800,
    twitter: 2500,
    linkedin: 3100,
  },
];

// Growth data for charts
export const growthData = [
  {
    month: "Jan",
    followers: 1200,
  },
  {
    month: "Feb",
    followers: 1900,
  },
  {
    month: "Mar",
    followers: 3000,
  },
  {
    month: "Apr",
    followers: 4000,
  },
  {
    month: "May",
    followers: 4800,
  },
  {
    month: "Jun",
    followers: 5500,
  },
];

// Analytics data
export const analyticsData: AnalyticsData[] = [
  {
    period: "Last 7 days",
    engagement: 3250,
    impressions: 12500,
    clicks: 870,
    followers: 5500,
  },
  {
    period: "Previous 7 days",
    engagement: 2980,
    impressions: 11200,
    clicks: 750,
    followers: 5300,
  },
  {
    period: "Last 30 days",
    engagement: 11200,
    impressions: 45000,
    clicks: 3200,
    followers: 5500,
  },
  {
    period: "Previous 30 days",
    engagement: 9800,
    impressions: 41000,
    clicks: 2900,
    followers: 4800,
  },
];