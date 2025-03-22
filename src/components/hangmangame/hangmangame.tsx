"use client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface Response {
  response_code: number;
  results: Question[];
}

const decodeHtmlEntities = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
};

const HangmanGame = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameState, setGameState] = useState<
    "loading" | "playing" | "won" | "level_complete" | "lost"
  >("loading");
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const router = useRouter();

  const [lastAnswerFeedback, setLastAnswerFeedback] = useState<string | null>(
    null
  );
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const maxWrongAnswers = 6;
  const questionsPerLevel = 6;
  const maxLevels = 20;

  const getDifficultyByLevel = (level: number) => {
    if (level <= 5) return "easy";
    if (level <= 15) return "medium";
    return "hard";
  };

  useEffect(() => {
    // Check if we already have cached questions for this level
    const cachedQuestions = localStorage.getItem(`questions_level_${level}`);
    if (cachedQuestions) {
      const parsedQuestions = JSON.parse(cachedQuestions);
      setQuestions(parsedQuestions);
      setCurrentQuestionIndex(0);
      setWrongAnswers(0);
      setLastAnswerFeedback(null);
      setGameState("playing");
      shuffleOptions(parsedQuestions[0]);
    } else {
      fetchQuestions();
    }
  }, [level]);
  const getSessionToken = async () => {
    try {
      const response = await fetch(
        "https://opentdb.com/api_token.php?command=request"
      );
      const data = await response.json();
      if (data.response_code === 0) {
        return data.token;
      }
      return null;
    } catch (error) {
      console.error("Error getting session token:", error);
      return null;
    }
  };
  useEffect(() => {
    const initSessionToken = async () => {
      const token = await getSessionToken();
      if (token) {
        setSessionToken(token);
        console.log("Session token retrieved:", token);
        // Store in localStorage for persistence
        localStorage.setItem("_token", token);
      }
    };

    // Check if we have a token in localStorage first
    const storedToken = localStorage.getItem("_token");
    if (storedToken) {
      setSessionToken(storedToken);
      console.log("Using stored session token:", storedToken);
    } else {
      initSessionToken();
    }
  }, []);

  const fetchQuestions = async (retryCount = 0, delay = 1000) => {
    try {
      const difficulty = getDifficultyByLevel(level);

      setGameState("loading");
      console.log(
        `Fetching ${questionsPerLevel} questions with difficulty: ${difficulty}`
      );

      // Build the API URL with the session token if available
      let apiUrl = `https://opentdb.com/api.php?amount=${questionsPerLevel}&category=9&difficulty=${difficulty}&type=multiple`;

      if (sessionToken) {
        apiUrl += `&token=${sessionToken}`;
      }

      console.log(`API URL: ${apiUrl}`);

      const response = await fetch(apiUrl);

      if (response.status === 429) {
        // Rate limited - implement exponential backoff
        console.log(`Rate limited. Retrying in ${delay / 1000} seconds...`);

        if (retryCount < 3) {
          // Limit retry attempts
          setTimeout(() => fetchQuestions(retryCount + 1, delay * 2), delay);
          return;
        } else {
          throw new Error("Rate limit exceeded after multiple retries");
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: Response = await response.json();
      console.log("API Response:", data);

      // Check if token needs to be reset (response code 4)
      if (data.response_code === 4) {
        console.log("Token expired, requesting a new one");
        const newToken = await getSessionToken();
        if (newToken) {
          setSessionToken(newToken);
          localStorage.setItem("_token", newToken);
          // Retry with new token
          setTimeout(() => fetchQuestions(retryCount, delay), 1000);
        } else {
          useDefaultQuestions();
        }
        return;
      }

      if (data.response_code === 0 && data.results && data.results.length > 0) {
        // Cache the questions in localStorage to reduce API calls
        localStorage.setItem(
          `questions_level_${level}`,
          JSON.stringify(data.results)
        );

        setQuestions(data.results);
        setCurrentQuestionIndex(0);
        setWrongAnswers(0);
        setLastAnswerFeedback(null);
        setGameState("playing");
        shuffleOptions(data.results[0]);
      } else {
        console.error(`API returned response code: ${data.response_code}`);
        // Check for cached questions before falling back to defaults
        const cachedQuestions = localStorage.getItem(
          `questions_level_${level}`
        );
        if (cachedQuestions) {
          const parsedQuestions = JSON.parse(cachedQuestions);
          setQuestions(parsedQuestions);
          setCurrentQuestionIndex(0);
          setWrongAnswers(0);
          setLastAnswerFeedback(null);
          setGameState("playing");
          shuffleOptions(parsedQuestions[0]);
        } else {
          useDefaultQuestions();
        }
      }
    } catch (error) {
      console.error("Error fetching  questions:", error);

      // Check for cached questions before falling back to defaults
      const cachedQuestions = localStorage.getItem(`questions_level_${level}`);
      if (cachedQuestions) {
        const parsedQuestions = JSON.parse(cachedQuestions);
        setQuestions(parsedQuestions);
        setCurrentQuestionIndex(0);
        setWrongAnswers(0);
        setLastAnswerFeedback(null);
        setGameState("playing");
        shuffleOptions(parsedQuestions[0]);
      } else {
        useDefaultQuestions();
      }
    }
  };
  // Add a fallback function with some default questions
  const useDefaultQuestions = () => {
    const defaultQuestions = [
      {
        category: "General Knowledge",
        type: "multiple",
        difficulty: "easy",
        question: "What is the capital of France?",
        correct_answer: "Paris",
        incorrect_answers: ["London", "Berlin", "Madrid"],
      },
      {
        category: "General Knowledge",
        type: "multiple",
        difficulty: "easy",
        question: "Which planet is known as the Red Planet?",
        correct_answer: "Mars",
        incorrect_answers: ["Venus", "Jupiter", "Mercury"],
      },
      {
        category: "General Knowledge",
        type: "multiple",
        difficulty: "easy",
        question: "What is the largest ocean on Earth?",
        correct_answer: "Pacific",
        incorrect_answers: ["Atlantic", "Indian", "Arctic"],
      },
      {
        category: "General Knowledge",
        type: "multiple",
        difficulty: "easy",
        question: "How many sides does a hexagon have?",
        correct_answer: "6",
        incorrect_answers: ["5", "7", "8"],
      },
      {
        category: "General Knowledge",
        type: "multiple",
        difficulty: "easy",
        question: "What is the primary color of the sky on a clear day?",
        correct_answer: "Blue",
        incorrect_answers: ["White", "Grey", "Orange"],
      },
      {
        category: "General Knowledge",
        type: "multiple",
        difficulty: "easy",
        question: "What is 2 + 2?",
        correct_answer: "4",
        incorrect_answers: ["3", "5", "22"],
      },
    ];

    console.log("Using default questions");
    setQuestions(defaultQuestions);
    setCurrentQuestionIndex(0);
    setWrongAnswers(0);
    setLastAnswerFeedback(null);
    setGameState("playing");
    shuffleOptions(defaultQuestions[0]);
  };

  const shuffleOptions = (question: Question) => {
    if (!question) return;

    const allOptions = [...question.incorrect_answers, question.correct_answer];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }

    setOptions(allOptions.map((option) => decodeHtmlEntities(option)));
  };

  const handleAnswer = (selectedAnswer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = decodeHtmlEntities(currentQuestion.correct_answer);
    const isCorrect = correctAnswer === selectedAnswer;

    if (isCorrect) {
      setScore(score + 1);
      setLastAnswerFeedback("Correct! Moving to next question...");

      // Move to next question
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < Math.min(questionsPerLevel, questions.length)) {
        // Set timeout to show feedback before moving to next question
        setTimeout(() => {
          setCurrentQuestionIndex(nextQuestionIndex);
          shuffleOptions(questions[nextQuestionIndex]);
          setLastAnswerFeedback(null);
        }, 1500);
      } else {
        // Level complete
        if (level < maxLevels) {
          setGameState("level_complete");
        } else {
          setGameState("won");
        }
      }
    } else {
      setWrongAnswers(wrongAnswers + 1);
      setLastAnswerFeedback(`Incorrect! Try again.`);

      if (wrongAnswers + 1 >= maxWrongAnswers) {
        setGameState("lost");
      }
    }
  };

  const moveToNextLevel = () => {
    setLevel(level + 1);
    setScore(0);
  };

  const resetGame = () => {
    setLevel(1);
    setCurrentQuestionIndex(0);
    setWrongAnswers(0);
    setScore(0);
    setGameState("loading");
    fetchQuestions();
  };

  const renderHangman = () => {
    const hangmanParts = [
      <circle
        key="head"
        cx="100"
        cy="80"
        r="20"
        className="stroke-black fill-none stroke-2"
      />,
      <line
        key="body"
        x1="100"
        y1="100"
        x2="100"
        y2="150"
        className="stroke-black stroke-2"
      />,
      <line
        key="leftArm"
        x1="100"
        y1="120"
        x2="70"
        y2="100"
        className="stroke-black stroke-2"
      />,
      <line
        key="rightArm"
        x1="100"
        y1="120"
        x2="130"
        y2="100"
        className="stroke-black stroke-2"
      />,
      <line
        key="leftLeg"
        x1="100"
        y1="150"
        x2="70"
        y2="180"
        className="stroke-black stroke-2"
      />,
      <line
        key="rightLeg"
        x1="100"
        y1="150"
        x2="130"
        y2="180"
        className="stroke-black stroke-2"
      />,
    ];

    return (
      <svg className="w-64 h-64 mx-auto">
        {/* Gallows */}
        <line
          x1="40"
          y1="200"
          x2="160"
          y2="200"
          className="stroke-black stroke-2"
        />
        <line
          x1="60"
          y1="200"
          x2="60"
          y2="40"
          className="stroke-black stroke-2"
        />
        <line
          x1="60"
          y1="40"
          x2="100"
          y2="40"
          className="stroke-black stroke-2"
        />
        <line
          x1="100"
          y1="40"
          x2="100"
          y2="60"
          className="stroke-black stroke-2"
        />

        {/* Hangman parts based on wrong answers */}
        {hangmanParts.slice(0, wrongAnswers)}
      </svg>
    );
  };

  if (gameState === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Loading Questions...</div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const handleBack = () => {
    router.push("/");
  };

  return (
    // <div className="min-h-screen bg-gray-100 p-4">
    <div className="max-w-4xl mx-auto bg-white bg-opacity-80 rounded-lg shadow-md p-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className="fixed top-4 left-4 bg-[#ffae00] border-2 border-white/40 hover:bg-[#ffce63] p-2 rounded-full shadow-lg flex items-center text-[#753109] gap-2"
      >
        <ArrowLeft className="w-6 h-6 text-gray-800 " />
        Back to Lobby
      </motion.button>
      <h1 className="text-3xl font-bold text-center mb-2">Hangman Game</h1>
      <div className="text-center mb-4">
        <span className="px-3 py-1 bg-purple-600 text-white text-sm font-bold rounded-full">
          Level {level}: {getDifficultyByLevel(level)}
        </span>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left Side - Hangman */}
        <div className="md:w-1/2 p-4">
          <div className="mb-6">{renderHangman()}</div>
          <div className="mb-4 text-center">
            <div className="text-lg font-semibold">
              Question {currentQuestionIndex + 1} of {questionsPerLevel}
            </div>
            <div className="text-sm text-gray-600">
              Wrong Answers: {wrongAnswers}/{maxWrongAnswers}
            </div>
            <div className="text-sm text-green-600">Score: {score}</div>
          </div>
        </div>

        {/* Right Side - MCQs */}
        <div className="md:w-1/2 p-4">
          {gameState === "playing" && currentQuestion && (
            <div>
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">
                  {decodeHtmlEntities(currentQuestion.category)}
                </div>
                <div className="text-xl font-medium">
                  {decodeHtmlEntities(currentQuestion.question)}
                </div>
              </div>

              {lastAnswerFeedback && (
                <div
                  className={`mb-4 p-2 rounded ${
                    lastAnswerFeedback.startsWith("Correct")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {lastAnswerFeedback}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {options.map((option, index) => (
                  <button
                    key={index}
                    className="bg-blue-50 hover:bg-blue-200 text-blue-800 font-medium py-3 px-4 rounded-lg transition-colors outline outline-1 outline-red-500"
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameState === "level_complete" && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Level {level} Complete!
              </h2>
              <p className="mb-4">
                You scored {score} out of {questionsPerLevel}!
              </p>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg"
                onClick={moveToNextLevel}
              >
                Next Level
              </button>
            </div>
          )}

          {gameState === "won" && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                You Won The Game!
              </h2>
              <p className="mb-4">
                Congratulations! You completed all {maxLevels} levels!
              </p>
              <p className="mb-4">
                Final score: {score} out of {questionsPerLevel}
              </p>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg"
                onClick={resetGame}
              >
                Play Again
              </button>
            </div>
          )}

          {gameState === "lost" && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Game Over
              </h2>
              <p className="mb-4">
                The hangman is complete. You scored {score} out of{" "}
                {questionsPerLevel}.
              </p>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
                onClick={resetGame}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    // </div>
  );
};

export default HangmanGame;
