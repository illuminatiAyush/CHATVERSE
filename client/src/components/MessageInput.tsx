"use client";

import { useState, useEffect, useRef } from "react";
import { socket } from "@/lib/socket";
import { Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "@/app/room/[roomCode]/page";

interface MessageInputProps {
  roomCode: string;
  username: string;
  replyingTo: Message | null;
  onCancelReply: () => void;
}

export default function MessageInput({ roomCode, username, replyingTo, onCancelReply }: MessageInputProps) {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const payload: { roomCode: string; text: string; username: string; replyTo?: { username: string; text: string } } = {
      roomCode,
      text,
      username,
    };

    if (replyingTo) {
      payload.replyTo = {
        username: replyingTo.username,
        text: replyingTo.text,
      };
      onCancelReply();
    }

    socket.emit("send_message", payload);
    setText("");
    
    // Stop typing indicator on send
    socket.emit("typing", { roomCode, username, isTyping: false });
    setIsTyping(false);

    // Re-focus input after send to prevent mobile keyboard dismissal
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  useEffect(() => {
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      socket.emit("typing", { roomCode, username, isTyping: true });
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false);
      socket.emit("typing", { roomCode, username, isTyping: false });
    }
  }, [text, isTyping, roomCode, username]);

  // Auto-focus input when replying to a message
  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  return (
    <div className="p-3 md:p-4 border-t-4 border-black bg-spider-white">
      {/* Reply preview banner */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 flex items-center gap-2 px-3 py-2 bg-spider-black/5 border-l-4 border-spider-red rounded-r-md overflow-hidden"
          >
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-marker text-spider-red uppercase block">
                Replying to {replyingTo.username}
              </span>
              <span className="text-xs font-fredoka text-spider-black/70 truncate block">
                {replyingTo.text}
              </span>
            </div>
            <button
              onClick={onCancelReply}
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-spider-red/10 text-spider-black/50 hover:text-spider-red transition-colors"
              aria-label="Cancel reply"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={replyingTo ? `Reply to ${replyingTo.username}...` : "Message..."}
          className="flex-1 px-4 py-3 md:py-2 border-4 border-black font-fredoka focus:outline-none focus:ring-0 bg-white text-spider-black text-base md:text-sm"
          enterKeyHint="send"
          autoComplete="off"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="bg-spider-red text-white px-4 py-2 border-4 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center justify-center min-w-[50px]"
        >
          <Send size={24} />
        </motion.button>
      </form>
    </div>
  );
}
