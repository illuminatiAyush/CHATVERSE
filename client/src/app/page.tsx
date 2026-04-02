"use client";

export const dynamic = "force-dynamic";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = () => {
    setIsCreating(true);
    socket.connect();
    socket.emit("create_room");
  };

  useEffect(() => {
    socket.on("room_created", (roomCode) => {
      router.push(`/join?code=${roomCode}`);
    });

    return () => {
      socket.off("room_created");
    };
  }, [router]);

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-x-hidden halftone-bg">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-spider-red opacity-10 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-spider-blue opacity-10 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="z-10 text-center max-w-4xl w-full">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex flex-col items-center"
        >
          <span className="relative h-24 w-24 md:h-32 md:w-32 flex-shrink-0 rounded-full overflow-hidden border-4 border-spider-black shadow-[4px_4px_0_rgba(0,0,0,1)] mb-4">
            <Image
              src="/spider.png"
              alt="WebVerse"
              width={128}
              height={128}
              className="h-full w-full object-cover"
            />
          </span>
          <h1 className="text-7xl md:text-9xl font-bangers text-spider-red glitch-text mb-2 drop-shadow-[4px_4px_0_rgba(255,255,255,1)]">
            WEBVERSE
          </h1>
          <p className="font-fredoka text-xl md:text-3xl text-spider-white italic mb-12 transform -rotate-2">
            Enter the Multiverse of the Web
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center px-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto"
          >
            <Link 
              href="/join"
              className="comic-button block w-full text-center py-4 px-12 bg-spider-blue"
            >
              JOIN ROOM
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto"
          >
            <button 
              onClick={handleCreateRoom}
              disabled={isCreating}
              className={`comic-button w-full py-4 px-12 flex items-center justify-center gap-2 ${isCreating ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  WARPING...
                </>
              ) : (
                "CREATE ROOM"
              )}
            </button>
          </motion.div>
        </div>

        {/* How it Works Section */}
        <section className="mt-32 w-full">
          <h2 className="text-5xl font-bangers text-spider-red mb-12 transform -rotate-1">
            HOW IT <span className="text-spider-white">WORKS</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-spider-white text-spider-black p-6 comic-panel rotate-1">
              <div className="bg-spider-red text-white w-12 h-12 flex items-center justify-center font-bangers text-3xl mb-4 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">1</div>
              <h3 className="font-bangers text-2xl mb-2">JOIN OR CREATE</h3>
              <p className="font-fredoka">Start a conversation instantly. Create a new room or enter an existing code.</p>
            </div>
            <div className="bg-spider-white text-spider-black p-6 comic-panel -rotate-1">
              <div className="bg-spider-blue text-white w-12 h-12 flex items-center justify-center font-bangers text-3xl mb-4 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">2</div>
              <h3 className="font-bangers text-2xl mb-2">INVITE SQUAD</h3>
              <p className="font-fredoka">Share the room link or code with friends. Anyone can join instantly from any dimension.</p>
            </div>
            <div className="bg-spider-white text-spider-black p-6 comic-panel rotate-1">
              <div className="bg-spider-red text-white w-12 h-12 flex items-center justify-center font-bangers text-3xl mb-4 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">3</div>
              <h3 className="font-bangers text-2xl mb-2">CHAT REAL-TIME</h3>
              <p className="font-fredoka">Messages appear instantly across all participants. Smooth, fast, and anonymous.</p>
            </div>
          </div>
        </section>

        {/* Why WebVerse Section */}
        <section className="mt-32 w-full">
          <div className="bg-spider-blue/20 p-8 rounded-3xl border-4 border-spider-blue/30 backdrop-blur-sm">
            <h2 className="text-5xl font-bangers text-spider-blue mb-12 transform rotate-1">
              WHY <span className="text-spider-white">WEBVERSE?</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "PRIVATE ROOMS", desc: "Create focused conversations for your team or friends." },
                { title: "INSTANT CHAT", desc: "No account required. Your time is valuable, don't waste it on signups." },
                { title: "LIGHTNING FAST", desc: "Built with WebSockets for ultra-low latency multiverse communication." },
                { title: "CROSS-DEVICE", desc: "Looks amazing on mobile, tablet, and desktop." }
              ].map((item, i) => (
                <div key={i} className="bg-spider-black/50 border-2 border-spider-blue p-4 flex gap-4 items-start hover:bg-spider-blue/10 transition-colors">
                  <div className="text-spider-blue mt-1">★</div>
                  <div className="text-left">
                    <h4 className="font-bangers text-xl text-spider-blue">{item.title}</h4>
                    <p className="text-sm font-fredoka">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mt-32 mb-20 w-full text-left">
          <h2 className="text-5xl font-bangers text-spider-white mb-12">
            MULTIVERSE <span className="text-spider-red">SCENARIOS</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Study Groups", icon: "📚", color: "bg-yellow-400" },
              { title: "Gaming", icon: "🎮", color: "bg-purple-500" },
              { title: "Events", icon: "🎉", color: "bg-green-500" },
              { title: "Dev Collab", icon: "💻", color: "bg-blue-500" }
            ].map((useCase, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className={`${useCase.color} p-4 comic-panel border-black text-black`}
              >
                <div className="text-4xl mb-2">{useCase.icon}</div>
                <h4 className="font-bangers text-xl">{useCase.title}</h4>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="mt-20 pb-8 text-center">
          <a
            href="https://github.com/illuminatiAyush"
            target="_blank"
            rel="noopener noreferrer"
            className="font-marker text-spider-white/70 hover:text-spider-red transition-colors text-sm md:text-base"
          >
            by @illuminatiAyush
          </a>
        </footer>
      </div>
    </main>
  );
}
