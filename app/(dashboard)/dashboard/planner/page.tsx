"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Filter } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { recentPosts } from "@/lib/demo-data";
import { Post } from "@/lib/types";

export default function PlannerPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [platform, setPlatform] = useState<string>("all");

  // Create a map of posts by date
  const postsByDate = recentPosts.reduce((acc, post) => {
    const date = post.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(post);
    return acc;
  }, {} as Record<string, Post[]>);

  // Filter posts for the current platform selection
  const filteredPosts = Object.entries(postsByDate).reduce(
    (acc, [date, posts]) => {
      if (platform === "all") {
        acc[date] = posts;
      } else {
        const filteredPosts = posts.filter(
          (post) => post.platform.toLowerCase() === platform
        );
        if (filteredPosts.length > 0) {
          acc[date] = filteredPosts;
        }
      }
      return acc;
    },
    {} as Record<string, Post[]>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Planner</h1>
          <p className="text-muted-foreground">
            Plan and schedule your social media content
          </p>
        </div>
        <Button className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Create New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Calendar</CardTitle>
              <CardDescription>
                Select a date to view scheduled content
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-3">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  classNames={{
                    months: "space-y-4",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: cn(
                      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                      "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                    ),
                    day: cn(
                      "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
                    ),
                    day_range_end: "day-range-end",
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    day_range_middle:
                      "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                  components={{
                    DayContent: (props) => {
                      const formattedDate = format(props.date, "yyyy-MM-dd");
                      const hasPost = !!filteredPosts[formattedDate];
                      
                      return (
                        <div className="relative h-8 w-8 p-0 flex items-center justify-center">
                          <span>{props.date.getDate()}</span>
                          {hasPost && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                          )}
                        </div>
                      );
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Platform</p>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Client</p>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="techcorp">TechCorp</SelectItem>
                    <SelectItem value="fashionstyle">FashionStyle</SelectItem>
                    <SelectItem value="consultpro">ConsultPro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                  </CardTitle>
                  <CardDescription>
                    {getPostCountText(date, filteredPosts)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setView("calendar")} className={cn(view === "calendar" ? "bg-secondary" : "")}>
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setView("list")} className={cn(view === "list" ? "bg-secondary" : "")}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {date && isDateInPostList(date, filteredPosts) ? (
                <div className="space-y-4">
                  {getPostsForDate(date, filteredPosts).map((post, index) => (
                    <div key={index} className="border rounded-md p-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Client: {post.client}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <PlatformBadge platform={post.platform} />
                          <StatusBadge status={post.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-medium">No posts scheduled</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    There are no posts scheduled for this date.
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upcoming Posts</CardTitle>
              <CardDescription>
                Next 7 days of scheduled content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getUpcomingPosts(filteredPosts).map((group, index) => (
                  <div key={index}>
                    <p className="text-sm font-medium mb-2">{group.date}</p>
                    <div className="space-y-2">
                      {group.posts.map((post, postIndex) => (
                        <div key={postIndex} className="flex items-center justify-between rounded-md border p-3 text-sm">
                          <div className="flex items-center gap-3">
                            <PlatformIcon platform={post.platform} />
                            <div>
                              <p className="font-medium">{post.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {post.client}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={post.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const platformColors: Record<string, string> = {
    Instagram: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Facebook: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Twitter: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    LinkedIn: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300",
  };
  
  return (
    <Badge className={platformColors[platform]} variant="outline">
      {platform}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, string> = {
    Published: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Scheduled: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    Draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  };
  
  return (
    <Badge className={statusColors[status]} variant="outline">
      {status}
    </Badge>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  const icons = {
    Instagram: <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 flex items-center justify-center"><Instagram className="h-4 w-4" /></div>,
    Facebook: <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center"><Facebook className="h-4 w-4" /></div>,
    Twitter: <div className="h-8 w-8 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300 flex items-center justify-center"><Twitter className="h-4 w-4" /></div>,
    LinkedIn: <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300 flex items-center justify-center"><Linkedin className="h-4 w-4" /></div>,
  };

  return icons[platform as keyof typeof icons] || null;
}

function isDateInPostList(date: Date, posts: Record<string, Post[]>) {
  const formattedDate = format(date, "yyyy-MM-dd");
  return !!posts[formattedDate];
}

function getPostsForDate(date: Date, posts: Record<string, Post[]>) {
  const formattedDate = format(date, "yyyy-MM-dd");
  return posts[formattedDate] || [];
}

function getPostCountText(date: Date | undefined, posts: Record<string, Post[]>) {
  if (!date) return "Select a date to view posts";
  
  const formattedDate = format(date, "yyyy-MM-dd");
  const postsForDate = posts[formattedDate] || [];
  
  if (postsForDate.length === 0) {
    return "No posts scheduled for this date";
  } else if (postsForDate.length === 1) {
    return "1 post scheduled";
  } else {
    return `${postsForDate.length} posts scheduled`;
  }
}

function getUpcomingPosts(posts: Record<string, Post[]>) {
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return format(date, "yyyy-MM-dd");
  });

  return next7Days
    .filter(date => !!posts[date])
    .map(date => ({
      date: format(new Date(date), "EEEE, MMMM d"),
      posts: posts[date],
    }));
}

import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";