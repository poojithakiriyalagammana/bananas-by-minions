"use client";

import { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader, Pencil, Save, X } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
}

export default function ProfilePage() {
  return (
    <SessionProvider>
      <ProfileContent />
    </SessionProvider>
  );
}

const ProfileContent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated" && session?.user?.email) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(
            `/api/profile?email=${session?.user?.email}`
          );
          const data = await response.json();
          setProfile(data);
          setEditForm({
            name: data.name,
            email: data.email,
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile");
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [session, router, status]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        name: profile.name,
        email: profile.email,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editForm,
          email: session?.user?.email,
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center  bg-amber-100">
        <Loader className="size-12 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-amber-100  flex items-center justify-center">
      <div className="bg-amber-200 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-amber-800">Your Profile</h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Edit
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-amber-900">Name</label>
            <Input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              disabled={!isEditing}
              className="w-full bg-white border-amber-300 focus:ring-amber-500"
            />
            <Input
              type="text"
              value={editForm.email}
              disabled={!isEditing}
              className="w-full bg-white border-amber-300 focus:ring-amber-500"
            />
          </div>

          {isEditing && (
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
