"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";

import LeaderboardPage from "@/components/leaderboard/leaderboard";
import HangmanGame from "../hangmangame/hangmangame";
import ProfilePage from "@/components/profile/profile";
import Link from "next/link";

const UserButton = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activePopup, setActivePopup] = useState<
    "play" | "signIn" | "leaderboard" | "profile" | "hangman" | null
  >(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (status === "loading" || !isClient) {
    return null;
  }

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleGameRedirect = (difficulty: string) => {
    router.push(`/game?difficulty=${difficulty}`);
    setActivePopup(null);
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  };

  const difficultyButtons = [
    {
      label: "Classic",
      color:
        "bg-[#edd17e] from-gray-300 to-gray-400 text-2xl font-bold text-[#1f1e1e] border-2 border-black/50",
      difficulty: "classic",
    },
    {
      label: "Easy",
      color:
        "bg-[#edd17e] from-gray-300 to-gray-400 text-2xl font-bold text-[#1f1e1e] border-2 border-black/50",
      difficulty: "easy",
    },
    {
      label: "Medium",
      color:
        "bg-[#edd17e] from-gray-300 to-gray-400 text-2xl font-bold text-[#1f1e1e] border-2 border-black/50",
      difficulty: "medium",
    },
    {
      label: "Hard",
      color:
        "bg-[#edd17e] from-gray-300 to-gray-400 text-2xl font-bold text-[#1f1e1e] border-2 border-black/50",
      difficulty: "hard",
    },
  ];

  const PopupWrapper = ({
    children,
    onClose,
  }: {
    children: React.ReactNode;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#693b0d] rounded-2xl p-6 relative max-w-md w-full"
      >
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-300"
        >
          <X className="w-8 h-8" />
        </Button>
        {children}
      </motion.div>
    </div>
  );

  return (
    <div>
      <div className="bg-[#6e2709]/75 backdrop-blur-lg rounded-3xl mt-16 shadow-2xl border-4 border-white/30 p-8 max-w-md w-full text-center">
        <h1 className="text-5xl font-bold text-[#FFFDD0] mb-6 drop-shadow-lg custom-heading">
          {session ? "LOBBY" : "WELCOME"}
        </h1>

        {session ? (
          <>
            {/* Profile */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex justify-center mb-6 cursor-pointer"
              onClick={() => setActivePopup("profile")}
            >
              <Avatar className="w-20 h-20 ring-4 ring-white/50 border-2 border-[#753109]">
                <AvatarImage
                  src={session.user?.image || ""}
                  className="object-cover rounded-full"
                />
                <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-pink-500 text-red text-2xl">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            {/* Play Button */}
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              className="mb-6 w-full"
            >
              <Button
                onClick={() => setActivePopup("play")}
                className="bg-[#ffae00] border-2 border-[#753109]  hover:bg-[#ffce63]  text-[#753109] text-2xl px-8 py-3 rounded-full shadow-xl  w-full"
              >
                Play
              </Button>
            </motion.div>

            {/* Leaderboard Button */}
            <div className="mb-6 w-full">
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Button
                  onClick={() => setActivePopup("leaderboard")}
                  className="bg-[#ffae00] border-2 border-[#753109]  hover:bg-[#ffce63]  text-[#753109] text-2xl px-8 py-3 rounded-full shadow-xl  w-full"
                >
                  Leader Board
                </Button>
              </motion.div>
            </div>
            <div className="mb-6 w-full">
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Button className="bg-[#992718] border-2 border-[#a63f3f]  hover:bg-[#94443a]  text-[#fff1e8] text-2xl px-8 py-3 rounded-full shadow-xl  w-full">
                  <Link href="/hangman">Hangman Game</Link>
                </Button>
              </motion.div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleSignOut}
              className="bg-[#753109] border-2 border-[#b86230]  hover:bg-[#a15122]  text-[#ffce63] text-2xl px-8 py-3 rounded-full shadow-xl  w-full"
            >
              <LogOut />
              Log out
            </Button>
          </>
        ) : (
          <>
            {/* Leaderboard Button */}
            <div className="mb-6 w-full">
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Button
                  onClick={() => setActivePopup("leaderboard")}
                  className="bg-[#ffae00] border-2 border-[#753109]  hover:bg-[#ffce63]  text-[#753109] text-2xl px-8 py-3 rounded-full shadow-xl  w-full"
                >
                  Leader Board
                </Button>
              </motion.div>
            </div>
            <div className="mb-6 w-full">
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Button className="bg-[#992718] border-2 border-[#a63f3f]  hover:bg-[#94443a]  text-[#fff1e8] text-2xl px-8 py-3 rounded-full shadow-xl  w-full">
                  <Link href="/hangman">Hangman Game</Link>
                </Button>
              </motion.div>
            </div>

            {/* Sign In Button */}
            <Button
              asChild
              className="bg-[#084d0a] hover:bg-[#0b850f] text-white text-2xl px-8 py-3 rounded-full shadow-xl border-2 border-[#084d0a]/30 w-full"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </>
        )}
      </div>

      <AnimatePresence>
        {activePopup === "play" && (
          <PopupWrapper onClose={() => setActivePopup(null)}>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-[# mb-6 drop-shadow-lg text-center custom-heading">
                Select Mode
              </h1>
              <div className="flex flex-col gap-2 items-center w-full">
                {difficultyButtons.map((btn) => (
                  <motion.div
                    key={btn.difficulty}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full max-w-60"
                  >
                    <button
                      onClick={() => handleGameRedirect(btn.difficulty)}
                      className={`w-full ${btn.color} text-black py-3 rounded-lg`}
                    >
                      {btn.label}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </PopupWrapper>
        )}

        {activePopup === "leaderboard" && (
          <PopupWrapper onClose={() => setActivePopup(null)}>
            <LeaderboardPage />
          </PopupWrapper>
        )}
        {activePopup === "hangman" && (
          <PopupWrapper onClose={() => setActivePopup(null)}>
            <HangmanGame />
          </PopupWrapper>
        )}

        {activePopup === "profile" && (
          <PopupWrapper onClose={() => setActivePopup(null)}>
            <ProfilePage />
          </PopupWrapper>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserButton;
