
import { useState, useEffect, useRef } from 'react';

interface Message {
  content: string;
  userId: string;
  name: string;
  timestamp: number;
}

export interface ChatState {
  roomId: string | null;
  messages: Message[];
  users: Map<string, string>;
  connected: boolean;
  error: string | null;
}

interface UseWebSocketProps {
  initialState: ChatState;
}

const WS_URL = 'ws://localhost:8080';

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
      setChatState(prev => ({ ...prev, connected: true, error: null }));
    };

    ws.onclose = () => {
      setChatState(prev => ({ 
        ...prev, 
        connected: false,
        error: 'Connection lost. Reconnecting...'
      }));
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = () => {
      setChatState(prev => ({ 
        ...prev, 
        error: 'Failed to connect to server' 
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    wsRef.current = ws;
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'room_created':
        setChatState(prev => ({ 
          ...prev, 
          roomId: data.roomId,
          error: null 
        }));
        break;

      case 'room_joined':
        setChatState(prev => ({ 
          ...prev, 
          roomId: data.roomId,
          error: null 
        }));
        break;

      case 'new_message':
        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, {
            content: data.content,
            userId: data.userId,
            name: data.name,
            timestamp: Date.now()
          }]
        }));
        break;

      case 'user_joined':
        setChatState(prev => {
          const newUsers = new Map(prev.users);
          newUsers.set(data.userId, data.name);
          return { ...prev, users: newUsers };
        });
        break;

      case 'user_left':
        setChatState(prev => {
          const newUsers = new Map(prev.users);
          newUsers.delete(data.userId);
          return { ...prev, users: newUsers };
        });
        break;

      case 'error':
        setChatState(prev => ({ 
          ...prev, 
          error: data.content 
        }));
        break;
    }
  };

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      setChatState(prev => ({
        ...prev,
        error: 'Connection lost. Please try again.'
      }));
    }
  };

  return {
    chatState,
    sendMessage,
    setChatState
  };
};