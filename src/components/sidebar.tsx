"use client"; // Indică faptul că acest cod este destinat să ruleze pe client (în browser), nu pe server

// Importă modulele și componentele necesare pentru a construi sidebar-ul
import Link from "next/link"; // Permite crearea de linkuri în aplicația Next.js
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react"; // Iconițe din pachetul lucide-react
import { cn } from "@/lib/utils"; // Funcție utilitară pentru a aplica clase CSS conditionate
import { Button, buttonVariants } from "@/components/ui/button"; // Componente de buton personalizate
import { Message } from "ai/react"; // Tipul de mesaj utilizat în aplicația de chat
import Image from "next/image"; // Permite încărcarea și optimizarea imaginilor în Next.js
import { Suspense, useEffect, useState } from "react"; // Suspense pentru încărcarea asincronă a componentelor
import SidebarSkeleton from "./sidebar-skeleton"; // Skeleton de încărcare pentru sidebar
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // Componente pentru avatar
import UserSettings from "./user-settings"; // Componente pentru setările utilizatorului
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area"; // Componente pentru zonele de scroll personalizate
import PullModel from "./pull-model"; // Componente pentru modelele de tip pull (preluare date)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"; // Componente pentru dialoguri și feronerie vizuală
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"; // Componente pentru meniurile derulante
import { TrashIcon } from "@radix-ui/react-icons"; // Iconiță de coș de gunoi din Radix UI
import { useRouter } from "next/navigation"; // Hook pentru navigarea între pagini
import useChatStore from "@/app/hooks/useChatStore"; // Hook personalizat pentru stocarea chat-urilor

// Definirea tipului pentru proprietățile componentei Sidebar
interface SidebarProps {
  isCollapsed: boolean; // Starea colapsată a sidebar-ului
  messages: Message[]; // Mesajele din chat
  onClick?: () => void; // Funcție opțională care va fi apelată la un click
  isMobile: boolean; // Determină dacă dispozitivul este mobil
  chatId: string; // ID-ul chat-ului curent
  closeSidebar?: () => void; // Funcție opțională pentru a închide sidebar-ul
}

// Componentele Sidebar
export function Sidebar({
  messages,
  isCollapsed,
  isMobile,
  chatId,
  closeSidebar,
}: SidebarProps) {
  const router = useRouter(); // Hook-ul pentru navigarea în aplicație

  // Accesarea stării globale a chat-urilor din store-ul de chat
  const chats = useChatStore((state) => state.chats);
  const handleDelete = useChatStore((state) => state.handleDelete);

  return (
    <div
      data-collapsed={isCollapsed} // Setează atributul collapsed în funcție de starea isCollapsed
      className="relative justify-between group lg:bg-accent/20 lg:dark:bg-card/35 flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      <div className=" flex flex-col justify-between p-2 max-h-fit overflow-y-auto">
        {/* Buton pentru crearea unui chat nou */}
        <Button
          onClick={() => {
            router.push("/"); // Navighează către pagina principală
            if (closeSidebar) {
              closeSidebar(); // Dacă există funcția de închidere a sidebar-ului, o apelează
            }
          }}
          variant="ghost" // Variantele de stil pentru buton
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
          <SquarePen size={18} className="shrink-0 w-4 h-4" /> {/* Iconița pentru un nou chat */}
        </Button>

        {/* Afișează lista de chat-uri ale utilizatorului */}
        <div className="flex flex-col pt-10 gap-2">
          <p className="pl-4 text-xs text-muted-foreground">Your chats</p>
          <Suspense fallback> {/* Suspense pentru încărcarea chat-urilor */}
            {chats &&
              Object.entries(chats)
                .sort(
                  ([, a], [, b]) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map(([id, chat]) => (
                  <Link
                    key={id}
                    href={`/c/${id}`} // Link către detaliile unui chat
                    className={cn(
                      {
                        [buttonVariants({ variant: "secondaryLink" })]:
                          id === chatId, // Dacă chat-ul este activ, aplică stilul corespunzător
                        [buttonVariants({ variant: "ghost" })]: id !== chatId, // Dacă nu este activ, aplică alt stil
                      },
                      "flex justify-between w-full h-14 text-base font-normal items-center "
                    )}
                  >
                    <div className="flex gap-3 items-center truncate">
                      <div className="flex flex-col">
                        <span className="text-xs font-normal ">
                          {chat.messages.length > 0
                            ? chat.messages[0].content
                            : ""}
                        </span>
                      </div>
                    </div>
                    {/* Meniu derulant pentru opțiuni de chat */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex justify-end items-center"
                          onClick={(e) => e.stopPropagation()} // Previi propagarea evenimentului
                        >
                          <MoreHorizontal size={15} className="shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className=" ">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full flex gap-2 hover:text-red-500 text-red-500 justify-start items-center"
                              onClick={(e) => e.stopPropagation()} // Previi propagarea evenimentului
                            >
                              <Trash2 className="shrink-0 w-4 h-4" />
                              Delete chat {/* Opțiune de ștergere a chat-ului */}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader className="space-y-4">
                              <DialogTitle>Delete chat?</DialogTitle> {/* Titlu dialog pentru confirmare ștergere */}
                              <DialogDescription>
                                Are you sure you want to delete this chat? This
                                action cannot be undone.
                              </DialogDescription>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button> {/* Buton pentru anulare */}
                                <Button
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Previi propagarea evenimentului
                                    handleDelete(id); // Șterge chat-ul din store
                                    router.push("/"); // Navighează înapoi pe pagina principală
                                  }}
                                >
                                  Delete
                                </Button> {/* Buton pentru confirmarea ștergerii */}
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Link>
                ))}
          </Suspense>
        </div>
      </div>

      {/* Setări utilizator */}
      <div className="justify-end px-2 py-2 w-full border-t">
        <UserSettings /> {/* Componenta pentru setările utilizatorului */}
      </div>
    </div>
  );
}
