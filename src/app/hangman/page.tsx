"use client";

import HangmanGame from "@/components/hangmangame/hangmangame";
import { Loader } from "lucide-react";
import React, { useState } from "react";

const Hangman: React.FC = () => {
  return <HangmanGame />;
};

const Hangmangame: React.FC = () => {
  return (
    <div className="bg-banana">
      <HangmanGame />
    </div>
  );
};

export default Hangmangame;
