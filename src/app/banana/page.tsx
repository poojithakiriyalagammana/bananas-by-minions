"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

// Define the shape of the data you're expecting
interface BananaData {
  question: string;
  solution: number;
}

const BananaGame: React.FC = () => {
  const [data, setData] = useState<BananaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("https://marcconrad.com/uob/banana/api.php");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result: BananaData = await response.json();
      setData(result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data && parseInt(userAnswer) === data.solution) {
      setMessage("Correct! Loading next question...");
      setTimeout(() => {
        setUserAnswer("");
        setMessage("");
        fetchData();
      }, 1500);
    } else {
      setMessage("Incorrect! Redirecting to game over...");
      setTimeout(() => {
        router.push("/game");
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader className="size-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Banana Game</h1>
      {data && (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-center mb-4">
            <img src={data.question} alt="Question" className="rounded-lg" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-lg w-full mb-4"
              placeholder="Your answer"
              required
            />
            <p>Solution: {data.solution}</p>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </form>
          {message && <p className="mt-4 text-center">{message}</p>}
        </div>
      )}
    </div>
  );
};

export default BananaGame;
