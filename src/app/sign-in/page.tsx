"use client";
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";

//react icons
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/");
      toast.success("login successful");
    } else if (res?.status === 401) {
      setError("Invalid Credentials");
      setPending(false);
    } else {
      setError("Something went wrong");
    }
  };

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "google"
  ) => {
    event.preventDefault();
    signIn(value, { callbackUrl: "/" });
  };
  return (
    <div className="bg-auth">
      <Card className="md:h-auto w-[80%] sm:w-[420px] p-4 sm:p-8 bg-[#5c4e06] border-[#500c35] border-2 shadow-2xl shadow-[#500c35]/50">
        <CardHeader>
          <CardTitle className="text-5xl font-bold text-[#FFFDD0] mb-6 drop-shadow-lg custom-heading">
            Sing In
          </CardTitle>
        </CardHeader>
        {!!error && (
          <div className="bg-red-900/20 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
            <TriangleAlert className="text-red-600" />
            <p>{error}</p>
          </div>
        )}
        <CardContent className="px-2 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              disabled={pending}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#fff9a1] border-[#500c35] text-[#000000] placeholder-[#a87c9f] focus:ring-[#8c1b5e] focus:border-[#8c1b5e]"
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#fff9a1] border-[#500c35] text-[#000000] placeholder-[#a87c9f] focus:ring-[#8c1b5e] focus:border-[#8c1b5e]"
            />

            <Button
              className="w-full bg-[#ffae00] hover:bg-[#ffce63] text-[#753109] text-2xl"
              size="lg"
              disabled={pending}
            >
              Continue
            </Button>
          </form>

          <Separator className="my-6 bg-[#ffe6b0]" />
          <div className="flex my-2 justify-evenly mx-auto items-center">
            <Button
              disabled={false}
              onClick={(e) => handleProvider(e, "google")}
              variant="outline"
              size="lg"
              className="bg-[#ffae00] border-[#500c35] text-[#753109] hover:bg-[#fff49e] "
            >
              <FcGoogle className="size-8 left-2.5 top-2.5 mr-2" />
              Sign in with Google
            </Button>
          </div>
          <p className="text-center text-sm mt-2 text-white">
            Create new account
            <Link
              className="text-[#fff49e] ml-4 hover:underline cursor-pointer"
              href="sign-up"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
