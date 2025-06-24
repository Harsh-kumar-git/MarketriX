"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Post } from "@/lib/types";

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "title",
    header: "Post Title",
    cell: ({ row }) => {
      const title: string = row.getValue("title");
      return <div className="font-medium">{title}</div>;
    },
  },
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => {
      const platform: string = row.getValue("platform");
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
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
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
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date: string = row.getValue("date");
      return <div>{date}</div>;
    },
  },
  {
    accessorKey: "engagement",
    header: "Engagement",
    cell: ({ row }) => {
      const engagement: number = row.getValue("engagement");
      return <div>{engagement}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const post = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(post.id)}
            >
              Copy post ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View post</DropdownMenuItem>
            <DropdownMenuItem>Edit post</DropdownMenuItem>
            <DropdownMenuItem>View analytics</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];