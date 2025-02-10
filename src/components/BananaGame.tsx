"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader,
  Timer,
  Award,
  AlertCircle,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

interface BananaData {
  question: string;
  solution: number;
}

interface Option {
  value: number;
  isCorrect: boolean;
}

const BananaGame: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "classic";

  const [data, setData] = useState<BananaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [options, setOptions] = useState<Option[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
    // Load saved score from localStorage
    const savedScore = localStorage.getItem("bananaGameScore");
    if (savedScore) {
      setScore(parseInt(savedScore));
    }

    // Set initial time based on difficulty
    if (difficulty === "medium") {
      setTimeLeft(60); // 1 minute for medium
    } else if (difficulty === "hard") {
      setTimeLeft(120); // 2 minutes for hard
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if ((difficulty === "medium" || difficulty === "hard") && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [difficulty, timeLeft]);

  useEffect(() => {
    localStorage.setItem("bananaGameScore", score.toString());
  }, [score]);

  const generateOptions = (solution: number): Option[] => {
    const options: Option[] = [{ value: solution, isCorrect: true }];
    while (options.length < 4) {
      const randomNum = Math.floor(Math.random() * 10);
      if (!options.some((opt) => opt.value === randomNum)) {
        options.push({ value: randomNum, isCorrect: false });
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const updateScore = async (newScore: number) => {
    try {
      const response = await fetch("/api/scores/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score: newScore,
          difficulty: difficulty,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update score");
      }

      const data = await response.json();

      if (data.updated) {
        toast.success("New high score!");
      }
    } catch (error) {
      console.error("Failed to update score:", error);
      toast.error("Failed to update score");
    }
  };

  const handleSubmit = (answer: string | number) => {
    const isCorrect = data && parseInt(String(answer)) === data.solution;

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      updateScore(newScore);
      setMessage("Correct! Loading next question...");

      // Reset timer based on difficulty
      if (difficulty === "medium") {
        setTimeLeft(60);
      } else if (difficulty === "hard") {
        setTimeLeft(120);
      }

      setTimeout(() => {
        setUserAnswer("");
        setMessage("");
        fetchData();
      }, 1500);
    } else {
      setShowModal(true);
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://marcconrad.com/uob/banana/api.php");
      if (!response.ok) throw new Error("Network response was not ok");
      const result: BananaData = await response.json();
      setData(result);

      // Generate options for easy and medium modes
      if (difficulty === "easy" || difficulty === "medium") {
        setOptions(generateOptions(result.solution));
      }

      // Reset timer for medium and hard modes
      if (difficulty === "medium") {
        setTimeLeft(60);
      } else if (difficulty === "hard") {
        setTimeLeft(120);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setShowModal(false);
    router.push(`/game?difficulty=${difficulty}`);
  };

  const handleBack = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center w-full h-screen bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <Loader className="size-12 animate-spin text-blue-500" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className="fixed top-4 left-4 bg-white p-2 rounded-full shadow-lg"
      >
        <ArrowLeft className="w-6 h-6 text-gray-600" />
      </motion.button>

      <div className="fixed top-4 left-16 right-4 flex justify-between items-center bg-white rounded-full shadow-lg p-4 mx-auto max-w-md">
        <motion.div
          animate={{ scale: score ? [1, 1.2, 1] : 1 }}
          className="flex items-center gap-2"
        >
          <Award className="text-yellow-500" />
          <span className="font-bold text-lg">{score} points</span>
        </motion.div>
        {(difficulty === "medium" || difficulty === "hard") && (
          <div className="flex items-center gap-2">
            <Timer
              className={`${timeLeft <= 10 ? "text-red-500" : "text-blue-500"}`}
            />
            <span
              className={`font-bold text-lg ${
                timeLeft <= 10 ? "text-red-500" : "text-blue-500"
              }`}
            >
              {timeLeft}s
            </span>
          </div>
        )}
      </div>

      <h1 className="text-4xl font-bold mb-6 mt-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        Banana Game - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}{" "}
        Mode
      </h1>

      {data && (
        <motion.div
          layout
          className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full"
        >
          <motion.div
            className="flex justify-center mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={data.question}
              alt="Question"
              className="rounded-xl shadow-lg"
            />
          </motion.div>

          {difficulty === "easy" || difficulty === "medium" ? (
            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSubmit(option.value)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  {option.value}
                </motion.button>
              ))}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(userAnswer);
              }}
              className="space-y-4"
            >
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Type your answer..."
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
              >
                Submit Answer
              </motion.button>
            </form>
          )}

          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-center font-medium text-gray-700"
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex flex-col items-center gap-4">
                <AlertCircle className="text-red-500 w-12 h-12" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Wrong Answer!
                </h2>
                <p className="text-gray-600 text-center">
                  Would you like to try again?
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTryAgain}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BananaGame;
