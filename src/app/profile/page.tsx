"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProfileComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div>
      <Avatar className="size-20 hover:opacity-75 transition">
        <AvatarImage
          className="size-20 hover:opacity-75 transition"
          src={session?.user?.image || undefined}
        />
        <AvatarFallback className="bg-sky-900 text-white">
          {session?.user?.name?.charAt(0).toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      <p>Email: {session?.user?.email}</p>
      <p>Name: {session?.user?.name}</p>
    </div>
  );
}

export default function Profile() {
  return (
    <SessionProvider>
      <ProfileComponent />
    </SessionProvider>
  );
}
