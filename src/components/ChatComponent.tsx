"use client";

import { useEffect, useRef, useState, memo } from "react";
import { ChatState, Message } from "@/hooks/useWebSocket";
import { MessageInput } from "./MessageInput";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader } from "./ui/card";

interface ChatComponentProps {
  chatState: ChatState;
  onSendMessage: (content: string) => void;
}

const ChatHeader = memo(
  ({ usersCount, connected ,roomId}: { usersCount: number; connected: boolean,roomId:string | null}) => (
    <CardHeader className="p-4 border-b border-neutral-800">
      <div className="flex items-center justify-between gap-2">
        <h2 className="sm:text-xl font-semibold text-neutral-200">
          Chat Room  ( {usersCount} online )
        </h2>
        
        <div className="flex items-center gap-2">
          <div>
            {roomId}
          </div>
          <span
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-neutral-400">
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>
    </CardHeader>
  )
);
ChatHeader.displayName = "ChatHeader";

export function ChatComponent({
  chatState,
  onSendMessage,
}: ChatComponentProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage("");
  };
  const { userCount, connected, messages, currentUserId ,roomId} = chatState;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="sm:w-[90%] max-w-screen-lg mx-4 bg-neutral-900/50 backdrop-blur-sm max-md:mx-4 ">
      <ChatHeader usersCount={userCount} connected={connected} roomId={roomId}/>

      <CardContent className="p-0 ">
        <ScrollArea className="h-[calc(100vh-200px)] sm:h-[calc(100vh-300px)] p-4">
          <div className="space-y-4 grid grid-cols-2 ">
            {messages.map((msg, index) => (
              <MessageCard
                key={index}
                message={msg}
                currentUserId={currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-neutral-800">
          <MessageInput
            message={message}
            isConnected={connected}
            onMessageChange={setMessage}
            onSend={handleSendMessage}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface MessageCardProps {
  message: Message;
  currentUserId: string | null;
}

export function MessageCard({ message, currentUserId }: MessageCardProps) {
  const isCurrentUser = message.userId === currentUserId;

  return (
    <div
      className={`  bg-neutral-800/50 border-neutral-700 hover:bg-secondary/70 transition-colors rounded-xl  ${
        isCurrentUser
          ? "ml-auto bg-primary/50 col-start-1 col-span-2"
          : "col-span-2 col-start-1 mr-auto"
      }`}
    >
      <div className="p-3 pb-0">
        <div
          className={`flex items-center gap-2 ${
            isCurrentUser ? "justify-end" : "justify-start"
          }`}
        >
          <span className="font-medium text-neutral-200 ">{message.name}</span>
          <span className="text-xs text-secondary-foreground ">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
      <div className="p-3 pt-0 flex flex-wrap">
        <p
          className={`text-neutral-300 break-words text-wrap ${
            isCurrentUser ? "text-right" : "text-left"
          }`}
        >
          {message.content}
        </p>
      </div>
    </div>
  );
}
