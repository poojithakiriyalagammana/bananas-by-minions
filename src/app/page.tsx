"use client";

import UserButton from "@/components/ui/user-button";
import { SessionProvider } from "next-auth/react";
import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

const Home: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-yellow-300 bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: "url('/images/minionBackground.png')" }}
    >
      <div className="text-center p-8 bg-white bg-opacity-80 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Bananas by Minions
        </h1>
        <p className="mb-8">Enjoy the fun and play the minion-themed game!</p>
        <div className="space-x-4">
          <SessionProvider>
            <UserButton />
          </SessionProvider>

          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
            onClick={() => (window.location.href = "/game")}
          >
            Play
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition">
            Score
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
