// app/api/scores/user/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import Score from "@/models/score";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty") || "classic";

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userScore = await Score.findOne({
      userId: user._id,
      difficulty: difficulty,
    });

    return NextResponse.json({
      score: userScore?.score || 0,
    });
  } catch (error) {
    console.error("Error fetching user score:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
