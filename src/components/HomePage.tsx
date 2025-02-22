"use client"

import { Button } from "@/components/ui/button";
import { LineShadowText } from "@/components/line-shadow-text";

interface HomePageProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export function HomePage({ onCreateRoom, onJoinRoom }: HomePageProps) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 space-y-8 md:space-y-12">
      <div className="space-y-6 md:space-y-8 text-center">
        <div className="flex text-6xl md:text-6xl lg:text-6xl font-semibold tracking-tight justify-center">
          Chat
          <span className="inline-block bg-secondary rounded-xl px-3 md:px-5 ml-2">
            <LineShadowText className="text-primary/80" shadowColor="white">
              Rooms
            </LineShadowText>
          </span>
        </div>
        <p className="text-md md:text-xl font-light text-neutral-200 max-w-lg mx-auto">
          On this website, you can create a private chat room and share data
          across multiple devices.
        </p>
      </div>

      <div className="md:flex gap-10 max-md:space-y-5 justify-center items-center pointer-events-auto">
        <Button
          size="lg"
          className="w-full md:w-auto text-md  transition-all shadow-lg duration-150"
          onClick={onCreateRoom}
          variant={"secondary"}
        >
          Create room ➜
        </Button>
        <Button
          size="lg"
          variant="ghost"
          className="text-md w-full md:w-auto  transition-all hover:shadow-lg duration-150 max-md:mt-2"
          onClick={onJoinRoom}
        >
          Join room
        </Button>
      </div>
    </div>
  );
}
