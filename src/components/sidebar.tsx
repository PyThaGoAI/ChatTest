"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Suspense } from "react";
import useChatStore from "@/app/hooks/useChatStore";
import {
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
  SquarePen,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  isMobile: boolean;
  chatId: string;
  closeSidebar?: () => void;
}

export function Sidebar({ isCollapsed, isMobile, chatId, closeSidebar }: SidebarProps) {
  const router = useRouter();
  const chats = useChatStore((state) => state.chats);

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative flex flex-col h-full gap-4 p-2"
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

      {/* Buttons Section */}
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
    </div>
  );
}
