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
import { ScrollArea } from "@radix-ui/react-scroll-area";
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
import useChatStore from "@/app/hooks/useChatStore";

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
  const chats = useChatStore((state) => state.chats);
  const handleDelete = useChatStore((state) => state.handleDelete);

  const filteredChats = Object.entries(chats)
    .filter(([id, chat]) => 
      chat.messages[0]?.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(([, a], [, b]) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group lg:bg-accent/20 flex flex-col h-full gap-4 p-2 transition-all duration-300"
    >
      <div className="space-y-4">
        {/* New Chat Button with Improved Styling */}
        <Button
          onClick={() => {
            router.push("/");
            closeSidebar?.();
          }}
          variant="ghost"
          className="w-full h-14 flex justify-between items-center rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            {!isCollapsed && !isMobile && (
              <Image
                src="/pytgicon.png"
                alt="AI"
                width={28}
                height={28}
                className="dark:invert"
              />
            )}
            <span className="text-sm xl:text-base">New Chat</span>
          </div>
          <SquarePen size={18} className="shrink-0" />
        </Button>

        {/* Search Input */}
        <div className="px-2">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-background border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
      </div>

      {/* Chat List with Improved Layout */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-2 text-xs text-muted-foreground pb-2">Recent chats</p>
          <Suspense fallback={<SidebarSkeleton />}>
            {filteredChats.map(([id, chat]) => (
              <div
                key={id}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-2 mx-2",
                  id === chatId 
                    ? "bg-accent/50 border border-primary"
                    : "hover:bg-accent/30"
                )}
              >
                <Link
                  href={`/c/${id}`}
                  className="flex-1 flex items-center gap-3 py-3"
                >
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary text-white">
                      {chat.messages[0]?.content[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      {chat.messages[0]?.content || 'New Chat'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>

                {/* Delete Button with Hover Effect */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-destructive/20"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full flex gap-2 text-destructive hover:bg-destructive/10 justify-start"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Conversation
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-destructive">
                            Confirm Deletion
                          </DialogTitle>
                          <DialogDescription>
                            This action will permanently delete the chat history.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline">Cancel</Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              handleDelete(id);
                              if(chatId === id) router.push("/");
                            }}
                          >
                            Confirm Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </Suspense>
        </div>
      </ScrollArea>

      {/* User Settings with Border */}
      <div className="border-t pt-4">
        <UserSettings />
      </div>
    </div>
  );
}
