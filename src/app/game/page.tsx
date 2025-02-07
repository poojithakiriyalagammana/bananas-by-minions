"use client";
import GameCanvas from "@/components/game/gameCanvas";
import { Loader } from "lucide-react";
import React from "react";

const Game: React.FC = () => {
  const [status, setStatus] = React.useState("loading");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("loaded");
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white/50">
        <Loader className="size-12 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to the Game Page</h1>
      <GameCanvas />
    </div>
  );
};

export default Game;
