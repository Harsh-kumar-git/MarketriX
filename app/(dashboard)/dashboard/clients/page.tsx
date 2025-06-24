"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Instagram, Facebook, Twitter, Linkedin, ExternalLink, MoreHorizontal } from "lucide-react";
import { demoClients } from "@/lib/demo-data";
import { Client } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredClients = demoClients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage all your client accounts and social profiles
          </p>
        </div>
        <Button className="shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-8 w-full md:max-w-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}

function ClientCard({ client }: { client: Client }) {
  const statusColors = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  };

  const platformIcons = {
    Instagram: <Instagram className="h-4 w-4" />,
    Facebook: <Facebook className="h-4 w-4" />,
    Twitter: <Twitter className="h-4 w-4" />,
    LinkedIn: <Linkedin className="h-4 w-4" />,
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
              <img 
                src={client.logo} 
                alt={client.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-xl">{client.name}</CardTitle>
              <CardDescription>{client.industry}</CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={statusColors[client.status]} variant="outline">
              {client.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Edit client</DropdownMenuItem>
                <DropdownMenuItem>View analytics</DropdownMenuItem>
                <DropdownMenuItem>Schedule content</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={client.website || "#"} target="_blank" className="flex items-center w-full">
                    Visit website
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Archive client
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="pt-2">
          <p className="text-sm font-medium mb-2">Connected Accounts</p>
          <div className="space-y-3">
            {client.accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center">
                    {platformIcons[account.platform]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{account.handle}</p>
                    <p className="text-xs text-muted-foreground">{account.followers.toLocaleString()} followers</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
                  <Link href={account.url} target="_blank">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="sr-only">Visit {account.platform}</span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}