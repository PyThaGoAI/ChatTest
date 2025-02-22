"use client";

import ChatTopbar from "./chat-topbar";
import ChatList from "./chat-list";
import ChatBottombar from "./chat-bottombar";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { Attachment, ChatRequestOptions, generateId } from "ai";
import { Message, useChat } from "ai/react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import useChatStore from "@/app/hooks/useChatStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface ChatProps {
  id: string;
  initialMessages: Message[] | [];
  isMobile?: boolean;
}

export default function Chat({ initialMessages, id, isMobile }: ChatProps) {
  // ... (keep all the existing hooks and state logic unchanged)

  return (
    <div className="flex flex-col w-full max-w-3xl h-full bg-background border border-muted/20 rounded-xl overflow-hidden">
      <ChatTopbar
        isLoading={isLoading}
        chatId={id}
        messages={messages}
        setMessages={setMessages}
      />

      {messages.length === 0 ? (
        <div className="flex flex-col h-full w-full items-center gap-6 justify-center px-4 py-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
            <Image
              src="/pytgicon.png"
              alt="AI"
              width={80}
              height={80}
              className="h-20 w-20 object-contain dark:invert filter brightness-110 drop-shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <p className="text-center text-lg font-medium text-foreground">
            How can I assist you today?
          </p>
          <ChatBottombar
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={onSubmit}
            isLoading={isLoading}
            stop={handleStop}
            setInput={setInput}
          />
        </div>
      ) : (
        <>
          <ChatList
            messages={messages}
            isLoading={isLoading}
            loadingSubmit={loadingSubmit}
            reload={async () => {
              removeLatestMessage();

              const requestOptions: ChatRequestOptions = {
                options: {
                  body: {
                    selectedModel: selectedModel,
                  },
                },
              };

              setLoadingSubmit(true);
              return reload(requestOptions);
            }}
          />
          <div className="border-t border-muted/20">
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              setInput={setInput}
            />
          </div>
        </>
      )}
    </div>
  );
}
