import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState } from "react";

interface JoinRoomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoin: (name: string, roomId: string) => void;
}

export function JoinRoomSheet({ open, onOpenChange, onJoin }: JoinRoomSheetProps) {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Join Room</SheetTitle>
          <SheetDescription>
            Enter your name and room ID to join the chat
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            maxLength={6}
          />
          <Button 
            className="w-full" 
            onClick={() => onJoin(name, roomId)}
            disabled={!name || !roomId}
          >
            Connect
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}