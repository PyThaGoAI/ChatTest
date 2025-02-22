"use client";

import Link from "next/link";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Suspense, useMemo } from "react";
import SidebarSkeleton from "./sidebar-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserSettings from "./user-settings";
import { ScrollArea } from "./ui/scroll-area";
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
  chatId: string;
  closeSidebar?: () => void;
}

export function Sidebar({ isCollapsed, chatId, closeSidebar }: SidebarProps) {
  const router = useRouter();
  const { chats, handleDelete } = useChatStore();

  const sortedChats = useMemo(
    () =>
      Object.entries(chats).sort(
        ([, a], [, b]) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [chats]
  );

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative justify-between group lg:bg-accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2"
    >
      <div className="flex flex-col justify-between p-2">
        <Button
          onClick={() => {
            router.push("/");
            closeSidebar?.();
          }}
          variant="ghost"
          className="flex justify-between w-full h-14 text-sm xl:text-lg font-normal items-center"
          aria-label="Start new chat"
        >
          <div className="flex gap-3 items-center">
            {!isCollapsed && (
              <Image
                src="/pytgicon.png"
                alt="AI"
                width={28}
                height={28}
                className="dark:invert hidden 2xl:block"
                aria-hidden="true"
              />
            )}
            New chat
          </div>
          <SquarePen size={18} className="shrink-0 w-4 h-4" />
        </Button>

        <div className="flex flex-col pt-10 gap-2">
          <p className="pl-4 text-xs text-muted-foreground">Your chats</p>
          <Suspense fallback={<SidebarSkeleton />}>
            <ScrollArea className="h-[calc(100vh-12rem)] pr-3">
              {sortedChats.map(([id, chat]) => (
                <Link
                  key={id}
                  href={`/c/${id}`}
                  className={cn(
                    buttonVariants({
                      variant: id === chatId ? "secondaryLink" : "ghost",
                    }),
                    "h-14 justify-between w-full text-base font-normal"
                  )}
                  onClick={closeSidebar}
                >
                  <span className="truncate text-xs font-normal">
                    {chat.messages?.[0]?.content || "New chat"}
                  </span>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="shrink-0 ml-2"
                        onClick={(e) => e.preventDefault()}
                        aria-label="Chat actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full flex gap-2 text-red-500 hover:text-red-600 justify-start"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Delete chat"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="mb-4">
                              Delete chat?
                            </DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this chat? This
                              action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                handleDelete(id);
                                if (chatId === id) router.push("/");
                              }}
                            >
                              Confirm Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Link>
              ))}
            </ScrollArea>
          </Suspense>
        </div>
      </div>

      <div className="px-2 py-2 w-full border-t">
        <UserSettings />
      </div>
    </div>
  );
}
