// app/api/scores/update/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import Score from "@/models/score";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { score, difficulty } = await req.json();

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find existing score
    const existingScore = await Score.findOne({
      userId: user._id,
      difficulty: difficulty,
    });

    // Only update if there's no existing score or new score is higher
    if (!existingScore || score > existingScore.score) {
      const updatedScore = await Score.findOneAndUpdate(
        {
          userId: user._id,
          difficulty: difficulty,
        },
        {
          $set: {
            score: score,
            userName: user.name,
            userEmail: user.email,
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      return NextResponse.json({
        success: true,
        score: updatedScore.score,
        updated: true,
      });
    }

    // Return existing score if new score is not higher
    return NextResponse.json({
      success: true,
      score: existingScore.score,
      updated: false,
    });
  } catch (error) {
    console.error("Error updating score:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
