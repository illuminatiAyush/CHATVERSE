"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { Message } from "@/app/room/[roomCode]/page";

interface ChatWindowProps {
  messages: Message[];
  currentUsername: string;
  onReply: (message: Message) => void;
}

export default function ChatWindow({ messages, currentUsername, onReply }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 halftone-bg-dark"
    >
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
          <div className="text-8xl mb-4 group-hover:animate-bounce transform rotate-12 transition-transform">⚡</div>
          <h3 className="text-3xl font-marker text-spider-black mb-2 uppercase">Silence in the Multiverse</h3>
          <p className="font-fredoka max-w-xs">No signals detected from this dimension yet. Be the first to break the void!</p>
        </div>
      )}
      
      {messages.map((msg, index) => (
        <MessageBubble 
          key={index} 
          message={msg} 
          isOwn={msg.username === currentUsername}
          onReply={() => onReply(msg)}
        />
      ))}
    </div>
  );
}
