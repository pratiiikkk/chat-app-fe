
import { memo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from 'lucide-react';
interface MessageInputProps {
  message: string;
  isConnected: boolean;
  onMessageChange: (value: string) => void;
  onSend: () => void;
}

export const MessageInput = memo(function MessageInput({ 
  message,
  isConnected,
  onMessageChange,
  onSend 
}: MessageInputProps) {
  return (
    <div className="flex gap-2 rounded-xl">
      <Input
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        className="flex-1 rounded-full bg-neutral-900/90  "
        disabled={!isConnected}
    
      />
      <Button 
        onClick={onSend}
        disabled={!isConnected}
        
        className='rounded-full'
      >
        <SendHorizontal/>
      </Button>
    </div>
  );
});