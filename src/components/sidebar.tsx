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
      className="relative group flex flex-col h-full gap-4 p-2 transition-all duration-300
               
                border-r border-muted/20 shadow-xl"
    >
      {/* Header Section */}
      <div className="space-y-4">
        {/* New Chat Button */}
        <Button
          onClick={() => {
            router.push("/");
            closeSidebar?.();
          }}
          variant="ghost"
          className="w-full h-14 flex justify-between items-center rounded-xl
                    bg-primary/10 hover:bg-primary/20 transition-all
                    border border-muted/20 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            {!isCollapsed && !isMobile && (
              <Image
                src="/pytgicon.png"
                alt="AI"
                width={28}
                height={28}
                className="dark:invert filter brightness-125 drop-shadow-sm"
              />
            )}
            <span className="text-sm xl:text-base font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              New Chat
            </span>
          </div>
          <SquarePen size={18} className="shrink-0 text-primary/80" />
        </Button>

        {/* Search Input */}
        <div className="relative px-2 group">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-background/95 backdrop-blur-sm
                      border border-muted/20 focus:border-primary/30
                      focus:ring-2 focus:ring-primary/10 focus:ring-offset-2
                      text-sm placeholder:text-muted-foreground/60
                      transition-all shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              ⌘F
            </kbd>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          <p className="px-2 text-xs font-medium text-muted-foreground/60 pb-2">
            Recent Chats
          </p>
          <Suspense fallback={<SidebarSkeleton />}>
            {filteredChats.map(([id, chat]) => (
              <div
                key={id}
                className={cn(
                  "group flex items-center justify-between rounded-xl px-2 mx-1",
                  "transition-all duration-200 hover:bg-muted/10",
                  id === chatId 
                    ? "bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary"
                    : "hover:border-l-2 border-primary/20"
                )}
              >
                <Link
                  href={`/c/${id}`}
                  className="flex-1 flex items-center gap-3 py-3"
                >
                  <Avatar className="h-9 w-9 border-2 border-primary/10 shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-primary/15 to-primary/5 text-foreground/80 font-medium">
                      {chat.messages[0]?.content[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground/90">
                      {chat.messages[0]?.content || 'New Chat'}
                    </p>
                    <p className="text-xs text-muted-foreground/60 font-light">
                      {new Date(chat.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </Link>

                {/* Delete Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity
                                rounded-lg hover:bg-destructive/10 text-destructive/80
                                hover:text-destructive border border-transparent
                                hover:border-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end"
                    className="rounded-xl border border-muted/20 shadow-xl"
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full flex gap-2 text-destructive/90 hover:bg-destructive/5 justify-start"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Conversation
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-2xl border-muted/20">
                        <DialogHeader>
                          <DialogTitle className="text-foreground/90">
                            Confirm Deletion
                          </DialogTitle>
                          <DialogDescription className="text-muted-foreground/80">
                            This action will permanently delete the chat history.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button 
                            variant="outline"
                            className="rounded-lg border-muted/20 hover:border-primary/30"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            className="rounded-lg bg-destructive/90 hover:bg-destructive shadow-sm"
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

      {/* User Settings */}
      <div className="border-t border-muted/20 pt-4">
        <UserSettings />
      </div>
    </div>
  );
}
