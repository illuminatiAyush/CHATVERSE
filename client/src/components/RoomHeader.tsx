"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, LogOut, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { socket } from "@/lib/socket";

interface RoomHeaderProps {
  roomCode: string;
  userCount: number;
}

export default function RoomHeader({ roomCode, userCount }: RoomHeaderProps) {
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const copyRoomLink = () => {
    const link = `${window.location.origin}/join?code=${roomCode}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleLogout = () => {
    socket.disconnect();
    sessionStorage.removeItem("webverse_username");
    router.push("/");
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between bg-spider-white p-3 md:p-4 comic-panel z-20 gap-3 md:gap-0">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity focus:outline-none"
          aria-label="WebVerse home"
        >
          <span className="relative h-10 w-10 md:h-12 md:w-12 flex-shrink-0 rounded-full overflow-hidden border-2 border-spider-black shadow-[2px_2px_0_rgba(0,0,0,1)]">
            <Image
              src="/spider.png"
              alt="WebVerse"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-bangers text-2xl md:text-4xl text-spider-red drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
            WEBVERSE
          </span>
        </button>
        
        <div className="flex-1 md:flex-none flex items-center gap-2 bg-spider-black text-spider-white px-3 py-1 skew-x-[-10deg] border-2 border-spider-red">
          <span className="font-marker text-sm md:text-lg tracking-wider">ROOM: {roomCode}</span>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6 w-full md:w-auto">
        <div className="flex items-center gap-2 font-fredoka font-bold text-[10px] md:text-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-spider-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-spider-blue"></span>
          </span>
          <span className="text-spider-black uppercase tracking-tighter">
            <span className="text-spider-red text-lg md:text-xl font-bangers">{userCount}</span> <span className="font-marker">HEROES ACTIVE</span>
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={copyRoomLink}
            className={`flex items-center gap-2 px-3 py-1.5 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all ${
              isCopied ? "bg-green-500 text-white" : "bg-spider-blue text-white hover:bg-spider-black"
            }`}
          >
            <AnimatePresence mode="wait">
              {isCopied ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check size={18} />
                </motion.div>
              ) : (
                <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Copy size={18} />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="font-bangers text-xs md:text-sm uppercase tracking-widest">
              {isCopied ? "COPIED!" : "INVITE"}
            </span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 bg-spider-red text-white border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:bg-spider-black active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <LogOut size={18} />
            <span className="font-bangers text-xs md:text-sm uppercase tracking-widest">LEAVE</span>
          </button>
          <a
            href="https://github.com/illuminatiAyush"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline font-marker text-spider-black/60 hover:text-spider-red text-xs ml-2 transition-colors"
          >
            @illuminatiAyush
          </a>
        </div>
      </div>
    </header>
  );
}
