"use client";

import { motion } from "framer-motion";
import { Message } from "@/app/room/[roomCode]/page";
import { cn } from "@/lib/utils";
import { Reply } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  onReply: () => void;
}

export default function MessageBubble({ message, isOwn, onReply }: MessageBubbleProps) {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <span className="bg-spider-black text-spider-white px-3 py-1 text-xs font-marker uppercase tracking-wider skew-x-12 border-2 border-spider-white">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, x: isOwn ? 20 : -20 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      className={cn(
        "flex flex-col max-w-[80%] group",
        isOwn ? "self-end items-end" : "self-start items-start"
      )}
    >
      <span className="text-xs font-marker text-spider-black/60 mb-1 px-1">
        {isOwn ? "YOU" : message.username.toUpperCase()} • {message.timestamp}
      </span>
      
      <div className={cn(
        "relative p-3 border-4 border-black font-fredoka font-bold text-spider-black",
        isOwn 
          ? "bg-spider-red rounded-l-2xl rounded-tr-2xl shadow-[4px_4px_0_rgba(0,0,0,1)]" 
          : "bg-spider-blue rounded-r-2xl rounded-tl-2xl shadow-[-4px_4px_0_rgba(0,0,0,1)] text-white"
      )}>
        {/* Reply reference */}
        {message.replyTo && (
          <div className={cn(
            "mb-2 px-2 py-1.5 rounded-md text-xs border-l-4",
            isOwn 
              ? "bg-black/15 border-black/40 text-spider-black/80" 
              : "bg-white/15 border-white/40 text-white/80"
          )}>
            <span className="font-marker text-[10px] uppercase block mb-0.5">
              ↩ {message.replyTo.username}
            </span>
            <span className="line-clamp-2 font-fredoka font-normal text-[11px]">
              {message.replyTo.text}
            </span>
          </div>
        )}

        {message.text}
        
        {/* Tail of the bubble */}
        <div className={cn(
          "absolute -bottom-1 w-4 h-4 border-b-4 border-black",
          isOwn 
            ? "right-2 bg-spider-red border-r-4 rotate-[15deg] translate-y-2" 
            : "left-2 bg-spider-blue border-l-4 -rotate-[15deg] translate-y-2"
        )} />
      </div>

      {/* Reply button — appears on hover */}
      <button
        onClick={onReply}
        className={cn(
          "mt-1 flex items-center gap-1 text-[10px] font-marker uppercase tracking-wider",
          "text-spider-black/40 hover:text-spider-red transition-colors",
          "opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100",
          "active:opacity-100"
        )}
        style={{ WebkitTapHighlightColor: 'transparent' }}
        aria-label="Reply to this message"
      >
        <Reply size={12} />
        Reply
      </button>
    </motion.div>
  );
}
