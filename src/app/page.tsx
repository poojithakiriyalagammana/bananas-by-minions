"use client";

import UserButton from "@/components/ui/user-button";
import { motion } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import React from "react";
import "tailwindcss/tailwind.css";

const Home: React.FC = () => {
  return (
    <div className="bg-main">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <SessionProvider>
          <UserButton />
        </SessionProvider>
      </motion.div>
    </div>
  );
};

export default Home;
