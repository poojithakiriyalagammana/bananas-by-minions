import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Score from "@/models/score";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty") || "classic";

    await connectToDatabase();

    const leaderboard = await Score.aggregate([
      { $match: { difficulty } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          score: 1,
          difficulty: 1,
          updatedAt: 1,
          userName: "$user.name",
          userEmail: "$user.email",
        },
      },
      { $sort: { score: -1, updatedAt: -1 } },
      { $limit: 10 },
    ]);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
