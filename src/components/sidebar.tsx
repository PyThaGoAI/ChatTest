"use client";

import Link from "next/link";
import { MoreHorizontal, SquarePen, Trash2, Search, Workflow, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Message } from "ai/react";
import Image from "next/image";
import { Suspense } from "react";
import SidebarSkeleton from "./sidebar-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserSettings from "./user-settings";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import PullModel from "./pull-model";
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
import { TrashIcon } from "@radix-ui/react-icons";
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
  const chats = useChatStore((state) => state.chats);
  const handleDelete = useChatStore((state) => state.handleDelete);

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative justify-between group lg:bg-accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      <div className="flex flex-col justify-between p-2 max-h-fit overflow-y-auto">
        {/* Buton New Chat */}
        <Button
          onClick={() => {
            router.push("/");
            if (closeSidebar) {
              closeSidebar();
            }
          }}
          variant="ghost"
          className="flex justify-between w-full h-14 text-sm xl:text-lg font-normal items-center "
        >
          <div className="flex gap-3 items-center ">
            {!isCollapsed && !isMobile && (
              <Image
                src="/pytgicon.png"
                alt="AI"
                width={28}
                height={28}
                className="dark:invert hidden 2xl:block"
              />
            )}
            New chat
          </div>
          <SquarePen size={18} className="shrink-0 w-4 h-4" />
        </Button>

        {/* Secțiunea cu butoanele noi */}
        <div className="flex flex-col gap-2 pt-4">
          <Button variant="ghost" className="flex items-center gap-3 w-full">
            <Search size={18} />
            {!isCollapsed && "Search"}
          </Button>

          <Button variant="ghost" className="flex items-center gap-3 w-full">
            <Workflow size={18} />
            {!isCollapsed && "Create a Flow"}
          </Button>

          <Button variant="ghost" className="flex items-center gap-3 w-full">
            <Bot size={18} />
            {!isCollapsed && "Create an Agent"}
          </Button>
        </div>

        {/* Lista de conversații */}
        <div className="flex flex-col pt-10 gap-2">
          <p className="pl-4 text-xs text-muted-foreground">Your chats</p>
          <Suspense fallback={<SidebarSkeleton />}>
            {chats &&
              Object.entries(chats)
                .sort(([, a], [, b]) => b.timestamp - a.timestamp)
                .map(([id, chat]) => (
                  <div key={id} className="flex items-center justify-between">
                    <Link href={`/chat/${id}`} className="w-full">
                      <Button
                        variant="ghost"
                        className="flex justify-between w-full text-sm font-normal"
                      >
                        <div className="flex gap-2 items-center truncate">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={chat.avatar} />
                            <AvatarFallback>{chat.name[0]}</AvatarFallback>
                          </Avatar>
                          {!isCollapsed && chat.name}
                        </div>
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              className="flex items-center gap-2 w-full"
                              onClick={() => handleDelete(id)}
                            >
                              <TrashIcon className="w-4 h-4" />
                              Delete
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
          </Suspense>
        </div>
      </div>

      {/* Setări utilizator */}
      <UserSettings />
    </div>
  );
}
