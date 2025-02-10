"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, User, LogOut } from "lucide-react";

const UserButton = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPopup, setShowPopup] = useState(false);

  if (status === "loading") {
    return null;
  }

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleGameRedirect = (difficulty: string) => {
    router.push(`/game?difficulty=${difficulty}`);
    setShowPopup(false);
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
      color: "bg-gradient-to-r from-gray-200 to-gray-300",
      difficulty: "classic",
    },
    {
      label: "Easy",
      color: "bg-gradient-to-r from-green-300 to-green-400",
      difficulty: "easy",
    },
    {
      label: "Medium",
      color: "bg-gradient-to-r from-yellow-300 to-yellow-400",
      difficulty: "medium",
    },
    {
      label: "Hard",
      color: "bg-gradient-to-r from-red-300 to-red-400",
      difficulty: "hard",
    },
  ];

  return (
    <div className="relative flex items-center gap-4">
      {session ? (
        <>
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <Button
              onClick={() => setShowPopup(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300"
            >
              <Play className="w-4 h-4" />
              <span>Play</span>
            </Button>
          </motion.div>

          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-12 right-0 bg-white dark:bg-gray-800 shadow-xl rounded-xl w-56 p-4 z-50 border border-gray-200 dark:border-gray-700"
              >
                <div className="space-y-4">
                  <p className="text-center text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Select Mode
                  </p>
                  <div className="flex flex-col gap-3">
                    {difficultyButtons.map((btn) => (
                      <motion.div
                        key={btn.difficulty}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <button
                          onClick={() => handleGameRedirect(btn.difficulty)}
                          className={`w-full ${btn.color} text-gray-800 font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform`}
                        >
                          {btn.label}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer"
              >
                <Avatar className="ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 transition-all duration-300">
                  <AvatarImage
                    src={session.user?.image || ""}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 mt-2 p-1 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
              <DropdownMenuItem
                asChild
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <Link href="/profile">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 text-red-500 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default UserButton;
