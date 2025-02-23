import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export interface Message {
  content: string;
  userId: string;
  name: string;
  timestamp: number;
}

interface BaseWebSocketMessage {
  type: string;
}

interface RoomCreatedMessage extends BaseWebSocketMessage {
  type: "room_created";
  roomId: string;
}

interface RoomJoinedMessage extends BaseWebSocketMessage {
  type: "room_joined";
  roomId: string;
  userCount: number;
}

interface NewMessageMessage extends BaseWebSocketMessage {
  type: "new_message";
  content: string;
  userId: string;
  name: string;
   
}

interface UserJoinedMessage extends BaseWebSocketMessage {
  type: "user_joined";
  userId: string;
  name: string;
  userCount: number;
}

interface UserLeftMessage extends BaseWebSocketMessage {
  type: "user_left";
  userId: string;
  userCount: number;
  name:string;

}

interface ErrorMessage extends BaseWebSocketMessage {
  type: "error";
  content: string;
}

interface ConnectWsMessage extends BaseWebSocketMessage {
  type: "system";
  userId: string;
}

type WebSocketIncomingMessage =
  | RoomCreatedMessage
  | RoomJoinedMessage
  | NewMessageMessage
  | UserJoinedMessage
  | UserLeftMessage
  | ErrorMessage
  |ConnectWsMessage;


interface CreateRoomMessage extends BaseWebSocketMessage {
  type: "create_room";
}

interface JoinRoomMessage extends BaseWebSocketMessage {
  type: "join_room";
  name: string;
  roomId: string;
}

interface SendChatMessage extends BaseWebSocketMessage {
  type: "send_message";
  content: string;
}

type WebSocketOutgoingMessage =
  | CreateRoomMessage
  | JoinRoomMessage
  | SendChatMessage;

export interface ChatState {
  roomId: string | null;
  messages: Message[];
  users: Map<string, string>;
  connected: boolean;
  error: string | null;
  userCount: number;
  currentUserId:string | null;
}

interface UseWebSocketProps {
  initialState: ChatState;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080" ;

export const useWebSocket = ({ initialState }: UseWebSocketProps) => {
  const [chatState, setChatState] = useState<ChatState>(initialState);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setChatState((prev) => ({ ...prev, error: null }));
    };

    ws.onclose = () => {
      setChatState((prev) => ({
        ...prev,
        connected: false,
        error: "Connection lost. Reconnecting...",
      }));
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = () => {
      setChatState((prev) => ({
        ...prev,
        error: "Failed to connect to server",
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    wsRef.current = ws;
  };

  const handleWebSocketMessage = (data: WebSocketIncomingMessage) => {
    switch (data.type) {
      case "room_created":
        setChatState((prev) => ({
          ...prev,
          roomId: data.roomId,
          error: null,
        }));
        break;
        case "system":
          setChatState((prev) => ({
            ...prev,
            currentUserId:data.userId,
            error: null,
          }));
          
          break;

      case "room_joined":
        setChatState((prev) => ({
          ...prev,
          roomId: data.roomId,
          error: null,
          connected: true,
          userCount: data.userCount,
        }));
        break;

      case "new_message":
        setChatState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              content: data.content,
              userId: data.userId,
              name: data.name,
              timestamp: Date.now(),
            },
            
          ],
        
        }));

        break;

      case "user_joined":
        setChatState((prev) => {
          const newUsers = new Map(prev.users);
          newUsers.set(data.userId, data.name);
          return { ...prev, userCount:data.userCount,users: newUsers };
        });
        toast.info(`new user joined "${data.name}"`)
        break;

      case "user_left":
        setChatState((prev) => {
          const newUsers = new Map(prev.users);
          newUsers.delete(data.userId);
          return { ...prev,userCount:data.userCount, users: newUsers };
        });
        toast.info(`user left "${data.name}"`)
        break;

      case "error":
        setChatState((prev) => ({
          ...prev,
          error: data.content,
        }));
        toast.error(data.content)
        break;
    }
  };

  const sendMessage = (message: WebSocketOutgoingMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      setChatState((prev) => ({
        ...prev,
        error: "Connection lost. Please try again.",
      }));
    }
  };

  const createRoom = (): Promise<string> => {
    return new Promise((resolve) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const handleRoomCreated = (event: MessageEvent) => {
          const data = JSON.parse(event.data);
          if (data.type === "room_created") {
            wsRef.current?.removeEventListener("message", handleRoomCreated);
            resolve(data.roomId);
          }
        };

        wsRef.current.addEventListener("message", handleRoomCreated);

        wsRef.current.send(
          JSON.stringify({
            type: "create_room",
          })
        );
      } else {
        setChatState((prev) => ({
          ...prev,
          error: "Connection lost. Please try again.",
        }));
        resolve("");
      }
    });
  };

  return {
    createRoom,
    chatState,
    sendMessage,
    setChatState,
  };
};
