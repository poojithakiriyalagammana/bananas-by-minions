"use client";
import GameCanvas from "@/components/game/gameCanvas";
import React from "react";

const Game: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Game Page</h1>
      <GameCanvas />
    </div>
  );
};

export default Game;
