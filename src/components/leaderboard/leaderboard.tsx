import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Trophy, Loader } from "lucide-react";
import { motion } from "framer-motion";
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
    router.push(`/?difficulty=${value}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full bg-[#8B5E00]">
        <Loader className="size-12 animate-spin text-[#FFE5B4]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#8B5E00] p-4"
    >
      <div className="max-w-full mx-auto pt-8">
        <h1 className="text-5xl font-bold text-[#FFFDD0] mb-6  custom-heading drop-shadow-lg">
          Leader Board
        </h1>

        <div className="bg-[#FFE5B4] rounded-xl p-2 shadow-2xl max-h-[400px] overflow-y-scroll custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold text-[#8B5E00]">
              {difficulty.toUpperCase()}
            </h2>
            <Select value={difficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger className="w-[150px] bg-[#8B5E00] text-[#FFE5B4]">
                <SelectValue placeholder="Select mode" />
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

          {leaderboard.length === 0 ? (
            <p className="text-center text-[#8B5E00] text-xl">
              No scores yet for {difficulty} mode!
            </p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={`${entry.userEmail}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#8B5E00]"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FFE5B4] text-[#8B5E00] text-1xl">
                      {index + 1}
                    </div>
                    <div>
                      <h6 className="text-[#FFE5B4]">{entry.userName}</h6>
                      <p className="text-[10px] text-[#FFE5B4]/70">
                        {entry.userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {index === 0 && (
                      <Trophy className="text-yellow-400 size-6" />
                    )}
                    <span className="font-bold text-3xl text-[#FFE5B4]">
                      {entry.score}
                    </span>
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
