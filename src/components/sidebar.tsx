"use client";

import Link from "next/link";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Message } from "ai/react";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import SidebarSkeleton from "./sidebar-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserSettings from "./user-settings";
import { ScrollArea, ScrollBar } from "@radix-ui/react-scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import useChatStore, { Chat } from "@/app/hooks/useChatStore";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface SidebarProps {
  isCollapsed: boolean;
  messages: Message[];
  onClick?: () => void;
  isMobile: boolean;
  chatId: string;
  closeSidebar?: () => void;
}

export function Sidebar({
  messages,
  isCollapsed,
  isMobile,
  chatId,
  closeSidebar,
}: SidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { chats, handleDelete } = useChatStore();
  
  const filteredChats = Object.entries(chats)
    .filter(([id, chat]) => {
      const searchMatch = chat.messages[0]?.content?.toLowerCase().includes(searchQuery.toLowerCase());
      const categoryMatch = selectedCategory === "all" || chat.category === selectedCategory;
      return searchMatch && categoryMatch;
    })
    .sort(([, a], [, b]) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const calculateStorageUsage = (chats: Record<string, Chat>) => {
    const size = new TextEncoder().encode(JSON.stringify(chats)).length;
    return `${(size / 1024).toFixed(1)}KB`;
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group lg:bg-accent/20 flex flex-col h-full gap-4 p-2 transition-all duration-300 ease-in-out"
    >
      {/* Header Section */}
      <div className="space-y-4">
        <Button
          onClick={() => {
            router.push("/");
            closeSidebar?.();
          }}
          variant="ghost"
          className="w-full h-14 flex justify-between items-center rounded-lg bg-primary/5 hover:bg-primary/10"
        >
          <div className="flex items-center gap-3">
            <SquarePen className="h-5 w-5" />
            {!isCollapsed && !isMobile && "New Chat"}
          </div>
          {!isCollapsed && !isMobile && (
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>N
            </kbd>
          )}
        </Button>

        {/* Search and Categories */}
        <div className="space-y-2">
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-lg bg-background shadow-sm"
          />
          <ScrollArea className="w-full overflow-x-auto pb-2">
            <div className="flex gap-2">
              {['all', 'work', 'personal', 'archived'].map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  className="cursor-pointer capitalize transition-colors hover:bg-primary/10"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          <Suspense fallback={<SidebarSkeleton />}>
            {filteredChats.map(([id, chat]) => (
              <Tooltip key={id}>
                <Link
                  href={`/c/${id}`}
                  className={cn(
                    buttonVariants({
                      variant: id === chatId ? 'secondary' : 'ghost',
                      size: 'lg',
                    }),
                    "group w-full h-14 justify-between rounded-lg px-3 transition-all",
                    "hover:bg-accent/50 hover:shadow-sm",
                    "data-[active=true]:border-primary data-[active=true]:bg-accent/50"
                  )}
                  data-active={id === chatId}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-primary text-white font-medium">
                        {chat.messages[0]?.content[0]?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm">
                      {chat.messages[0]?.content || 'New Chat'}
                    </span>
                  </div>

                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-destructive/20 hover:text-destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  
                  <TooltipContent side="right">
                    <p>Delete chat</p>
                  </TooltipContent>
                </Link>
              </Tooltip>
            ))}
          </Suspense>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

      {/* Footer Section */}
      <div className="border-t pt-4 space-y-4">
        <UserSettings />
        <div className="text-center text-xs text-muted-foreground">
          <p>Storage used: {calculateStorageUsage(chats)}</p>
          <p className="mt-1">Version: {process.env.NEXT_PUBLIC_APP_VERSION}</p>
        </div>
      </div>
    </div>
  );
}
