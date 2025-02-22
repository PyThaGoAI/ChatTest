"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Message } from "ai/react";
import Image from "next/image";
import useChatStore from "@/app/hooks/useChatStore";
import {
  MoreHorizontal,
  SquarePen,
  Trash2,
  Search,
  Workflow,
  Bot,
  BarChart3,
  LineChart,
  Users,
  Truck,
  Activity,
  Settings,
  HelpCircle,
} from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import SidebarSkeleton from "./sidebar-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserSettings from "./user-settings";
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
      className="relative flex flex-col h-full gap-4 p-2 lg:bg-accent/20 lg:dark:bg-card/35"
    >
      {/* New Chat Button */}
      <Button
        onClick={() => {
          router.push("/");
          if (closeSidebar) closeSidebar();
        }}
        variant="ghost"
        className="flex items-center gap-3 w-full justify-start"
      >
        <SquarePen size={18} />
        {!isCollapsed && "New Chat"}
      </Button>

      {/* Extra Buttons */}
      <div className="flex flex-col gap-2">
        <Button variant="ghost" className="flex items-center gap-3 w-full justify-start">
          <Search size={18} />
          {!isCollapsed && "Search"}
        </Button>

        <Button variant="ghost" className="flex items-center gap-3 w-full justify-start">
          <Workflow size={18} />
          {!isCollapsed && "Create a Flow"}
        </Button>

        <Button variant="ghost" className="flex items-center gap-3 w-full justify-start">
          <Bot size={18} />
          {!isCollapsed && "Create an Agent"}
        </Button>

        <Button variant="ghost" className="flex items-center gap-3 w-full justify-start">
          <BarChart3 size={18} />
          {!isCollapsed && "Reports"}
        </Button>

        <Button variant="ghost" className="flex items-center gap-3 w-full justify-start">
          <LineChart size={18} />
          {!isCollapsed && "Analytics"}
        </Button>

        <Button variant="ghost" className="flex items-center gap-3 w-full justify-start">
          <Users size={18} />
          {!isCollapsed && "Team Management"}
        </Button>

        <Button variant="ghost" className="flex items-center gap-3 w-full justify-start">
          <Truck size={18} />
          {!isCollapsed && "Delivery Insights"}
        </Button>

        <Button variant="ghost" className="flex items-center gap-3 w-full justify-start">
          <Activity size={18} />
          {!isCollapsed && "Performance Tracker"}
        </Button>

        <Button variant="ghost" className="flex items-center gap-3 w-full justify-start">
          <Settings size={18} />
          {!isCollapsed && "Settings"}
        </Button>

        <Button variant="ghost" className="flex items-center gap-3 w-full justify-start">
          <HelpCircle size={18} />
          {!isCollapsed && "Help Center"}
        </Button>
      </div>

      {/* Chats Section */}
      <div className="flex flex-col pt-10 gap-2">
        <p className="pl-4 text-xs text-muted-foreground">Your chats</p>
        <Suspense fallback={<SidebarSkeleton />}>
          {chats &&
            Object.entries(chats)
              .sort(([, a], [, b]) => b.timestamp - a.timestamp)
              .map(([id, chat]) => (
                <Button
                  key={id}
                  onClick={() => router.push(`/chat/${id}`)}
                  variant="ghost"
                  className="flex justify-between w-full text-sm font-normal items-center"
                >
                  <div className="flex gap-3 items-center">
                    <Avatar>
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    {!isCollapsed && chat.name}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal size={18} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DialogTrigger asChild>
                        <Button variant="ghost" onClick={() => handleDelete(id)}>
                          <Trash2 size={18} className="mr-2" />
                          Delete
                        </Button>
                      </DialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Button>
              ))}
        </Suspense>
      </div>
    </div>
  );
}
