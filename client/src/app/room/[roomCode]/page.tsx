"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import ChatWindow from "@/components/ChatWindow";
import MessageInput from "@/components/MessageInput";
import UserList from "@/components/UserList";
import RoomHeader from "@/components/RoomHeader";
import { motion, AnimatePresence } from "framer-motion";

export type Message = {
  username: string;
  text: string;
  timestamp: string;
  type: 'user' | 'system';
  replyTo?: {
    username: string;
    text: string;
  };
};

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params?.roomCode as string) || "";
  
  const [username, setUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !roomCode) return;

    const storedUsername = sessionStorage.getItem("webverse_username");
    if (!storedUsername) {
      router.push("/join");
      return;
    }
    setUsername(storedUsername);

    // Socket events
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("[Socket] Connected to server:", socket.id);
      socket.emit("join_room", { roomCode, username: storedUsername });
    };

    socket.on("connect", onConnect);
    
    // If already connected, join room
    if (socket.connected) {
      onConnect();
    }

    socket.on("user_list", (userList: string[]) => {
      setUsers(userList || []);
    });

    socket.on("message_history", (history: Message[]) => {
      setMessages(history || []);
    });

    socket.on("receive_message", (message: Message) => {
      if (message) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("display_typing", (data) => {
      if (!data) return;
      const { username: tUser, isTyping } = data;
      if (isTyping && tUser !== storedUsername) {
        setTypingUser(tUser);
      } else {
        setTypingUser(null);
      }
    });

    socket.on("error_message", (error: string) => {
      console.error("[Socket] Error received:", error);
      alert(error);
      router.push("/join");
    });

    setIsJoined(true);

    return () => {
      socket.off("connect", onConnect);
      socket.off("user_list");
      socket.off("message_history");
      socket.off("receive_message");
      socket.off("display_typing");
      socket.off("error_message");
    };
  }, [mounted, roomCode, router]);

  if (!mounted || !isJoined || !username || !roomCode) {
    return (
      <div className="h-screen flex items-center justify-center bg-spider-black halftone-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-spider-red border-t-transparent rounded-full animate-spin" />
          <p className="font-marker text-2xl text-spider-white tracking-widest animate-pulse uppercase">WARPING TO DIMENSION...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="h-[100dvh] flex flex-col bg-spider-black halftone-bg overflow-hidden p-0 md:p-4 gap-0 md:gap-4">
      <RoomHeader roomCode={roomCode} userCount={users.length} />
      
      <div className="flex-1 flex flex-col md:flex-row gap-0 md:gap-4 overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden bg-spider-white comic-panel-mobile md:comic-panel">
          <ChatWindow 
            messages={messages} 
            currentUsername={username}
            onReply={(msg) => setReplyingTo(msg)}
          />
          
          <AnimatePresence>
            {typingUser && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-4 py-1 text-xs md:text-sm font-fredoka text-spider-black italic bg-spider-white/90 border-t border-spider-black/10"
              >
                {typingUser} is glitching... (typing)
              </motion.div>
            )}
          </AnimatePresence>
          
          <MessageInput 
            roomCode={roomCode} 
            username={username}
            replyingTo={replyingTo}
            onCancelReply={() => setReplyingTo(null)}
          />
        </div>
        
        <div className="hidden md:block w-72 bg-spider-white comic-panel">
          <UserList users={users} />
        </div>
      </div>
    </main>
  );
}

