"use client";
import BananaGame from "@/components/BananaApi/BananaGame";
import { Loader } from "lucide-react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const BananaContent: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white/50">
        <Loader className="size-12 animate-spin" />
      </div>
    );
  }

  return <BananaGame />;
};

const Banana: React.FC = () => {
  return (
    <div className="bg-banana">
      <SessionProvider>
        <BananaContent />
      </SessionProvider>
    </div>
  );
};

export default Banana;
