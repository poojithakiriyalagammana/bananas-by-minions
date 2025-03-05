"use client";

import GameCanvas from "@/components/game/gameCanvas";
import { ArrowLeft, Loader } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const GameContent = () => {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white/50">
        <Loader className="h-12 w-12 animate-spin" />
      </div>
    );
  }
  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="custom-heading text-5xl font-bold mb-4 drop-shadow-lg py-4">
        Find The Banana
      </h1>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className="fixed top-4 left-4 bg-[#ffae00] border-2 border-white/40  hover:bg-[#ffce63] p-2 rounded-full shadow-lg flex items-center  text-[#753109] gap-2"
      >
        <ArrowLeft className="w-6 h-6 text-gray-800 " />
        Back to Lobby
      </motion.button>
      <GameCanvas />
    </div>
  );
};

const Game = () => {
  return (
    <div className="bg-gamemode">
      <SessionProvider>
        <GameContent />
      </SessionProvider>
    </div>
  );
};

export default Game;
