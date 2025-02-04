"use client";

import UserButton from "@/components/ui/user-button";
import { SessionProvider } from "next-auth/react";
import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";

const Home: React.FC = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleLoginClick = () => {
    setIsVisible(true); // Make popup container visible
    setTimeout(() => setShowSignup(true), 50); // Slight delay for smooth effect
  };

  const handleClosePopup = () => {
    setShowSignup(false);
    setTimeout(() => setIsVisible(false), 300); // Hide popup after animation ends
  };

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

          <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition">
            Play
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition">
            Score
          </button>
        </div>

        {/* Popup Modal with Smooth Animation */}
        {isVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <div
              className={`bg-white p-8 rounded-lg shadow-lg relative transform transition-all duration-300 ${
                showSignup ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
            >
              <button
                onClick={handleClosePopup}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
