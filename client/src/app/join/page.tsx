"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { socket } from "@/lib/socket";

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setRoomCode(code);
    }
  }, [searchParams]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedRoom = roomCode.trim();
    if (!trimmedUsername || !trimmedRoom) {
      setError("Provide a name and room code, Avenger!");
      return;
    }

    // Connect to socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // We'll pass the state via URL or session storage for the room page
    // For this app, we'll store username in sessionStorage and redirect
    sessionStorage.setItem("webverse_username", trimmedUsername);
    router.push(`/room/${trimmedRoom.toUpperCase()}`);
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 halftone-bg">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full bg-spider-white p-8 comic-panel"
      >
        <h2 className="text-4xl font-marker text-spider-black mb-6 text-center">
          Multiverse <span className="text-spider-red">Entry</span>
        </h2>

        <form onSubmit={handleJoin} className="space-y-6">
          <div>
<label className="block font-marker text-spider-black text-xl mb-1">
            DISPLAY NAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="E.g. Spiderman"
              className="w-full px-4 py-3 border-4 border-black font-fredoka focus:outline-none focus:ring-0 text-spider-black"
            />
          </div>

          <div>
<label className="block font-marker text-spider-black text-xl mb-1">
            ROOM CODE / KEY
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Any secret key..."
              className="w-full px-4 py-3 border-4 border-black font-fredoka focus:outline-none focus:ring-0 uppercase text-spider-black"
            />
            <p className="mt-1 text-[10px] font-fredoka text-spider-black/60 uppercase">
              Tip: Entering a new code creates that dimension instantly!
            </p>
          </div>

          {error && (
            <p className="text-spider-red font-bold text-center italic">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02, rotate: -1 }}
            type="submit"
            className="comic-button w-full py-4 text-2xl"
          >
            ENTER MULTIVERSE
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => router.push("/")}
            className="text-spider-black underline font-bold hover:text-spider-red transition-colors"
          >
            ← BACK TO SAFETY
          </button>
        </div>
      </motion.div>
    </main>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-spider-white font-marker text-4xl">LOADING DIMENSION...</div>}>
      <JoinForm />
    </Suspense>
  );
}
