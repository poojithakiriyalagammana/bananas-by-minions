"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import Link from "next/link";

//react icons
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";
import { signIn } from "next-auth/react";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setPending(false);
      setLoading(false);
      toast.success(data.message);
      router.push("/sign-in");
    } else if (res.status === 400 || res.status === 500) {
      setError(data.message);
      setPending(false);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white/50">
        <Loader className="size-12 animate-spin" />
      </div>
    );
  }

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
            Sign Up
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
              type="text"
              disabled={pending}
              placeholder="User Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="bg-[#fff9a1] border-[#500c35] text-[#000000] placeholder-[#a87c9f] focus:ring-[#8c1b5e] focus:border-[#8c1b5e]"
            />
            <Input
              type="email"
              disabled={pending}
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="bg-[#fff9a1] border-[#500c35] text-[#000000] placeholder-[#a87c9f] focus:ring-[#8c1b5e] focus:border-[#8c1b5e]"
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="bg-[#fff9a1] border-[#500c35] text-[#000000] placeholder-[#a87c9f] focus:ring-[#8c1b5e] focus:border-[#8c1b5e]"
            />
            <Input
              type="password"
              disabled={pending}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
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
            Already have an account?
            <Link
              className="text-[#fff49e] ml-4 hover:underline cursor-pointer"
              href="sign-in"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
