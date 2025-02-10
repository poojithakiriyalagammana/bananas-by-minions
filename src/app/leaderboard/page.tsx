// app/leaderboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeaderboardEntry {
  userName: string;
  userEmail: string;
  score: number;
  createdAt: string;
}

const difficulties = [
  { value: "classic", label: "Classic" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "classic";

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/scores/leaderboard?difficulty=${difficulty}`
        );
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [difficulty]);

  const handleDifficultyChange = (value: string) => {
    router.push(`/leaderboard?difficulty=${value}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Loader className="size-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 bg-white p-2 rounded-full shadow-lg"
      >
        <ArrowLeft className="w-6 h-6 text-gray-600" />
      </motion.button>

      <div className="max-w-2xl mx-auto pt-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Leaderboard
        </h1>

        <div className="mb-6 flex justify-center">
          <Select value={difficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((diff) => (
                <SelectItem key={diff.value} value={diff.value}>
                  {diff.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-500">
              No scores yet for {difficulty} mode!
            </p>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={`${entry.userEmail}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{entry.userName}</h3>
                      <p className="text-sm text-gray-500">{entry.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold opacity-20">
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </span>

                    {index === 0 && <Trophy className="text-yellow-500" />}
                    <span className="font-bold text-lg">{entry.score}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LeaderboardPage;
