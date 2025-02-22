"use client";
import { useState } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { HomePage } from "@/components/HomePage";
import { JoinRoomSheet } from "@/components/JoinRoomSheet";

import { toast } from "sonner";
import { ChatComponent } from "@/components/ChatComponent";

export default function Home() {
  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const { chatState, sendMessage, createRoom } = useWebSocket({
    initialState: {
      roomId: null,
      connected: false,
      error: null,
      messages: [],
      users: new Map(),
      userCount: 0,
      currentUserId: null,
    },
  });

  const handleCreateRoom = async () => {
    if (chatState.roomId) {
      navigator.clipboard.writeText(chatState.roomId);
      toast.success("Room ID copied to clipboard!");
      return;
    }

    const newRoomId = await createRoom();
    navigator.clipboard.writeText(newRoomId);
    toast.success("Room created and ID copied to clipboard!");
  };

  const handleJoinRoom = (name: string, roomId: string) => {
    sendMessage({
      type: "join_room",
      name,
      roomId,
    });
    setShowJoinSheet(false);
  };
  const handleSendMessage = (content: string) => {
    sendMessage({
      type: "send_message",
      content,
    });
  };

  const showChatRoom = chatState.roomId && chatState.connected;
  return (
    <div className=" min-h-screen ">
      <main className="flex flex-col items-center justify-center flex-1 z-10 py-8 md:py-12  h-screen">
        {!showChatRoom ? (
          <HomePage
            onCreateRoom={handleCreateRoom}
            onJoinRoom={() => setShowJoinSheet(true)}
          />
        ) : (
          <ChatComponent
           
            onSendMessage={handleSendMessage}
            chatState={chatState}
          />
        )}
      </main>

      <JoinRoomSheet
        open={showJoinSheet}
        onOpenChange={setShowJoinSheet}
        onJoin={handleJoinRoom}
      />
    </div>
  );
}
