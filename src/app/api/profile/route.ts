// app/api/profile/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/user";
import Score from "@/models/score";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const user = await User.findOne({ email }, "name email");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { email, name, newEmail } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if new email already exists (if email is being changed)
    if (newEmail && newEmail !== email) {
      const existingUser = await User.findOne({ email: newEmail });
      if (existingUser) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Update user information in User table
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        name,
        ...(newEmail && { email: newEmail }),
      },
      { new: true, select: "name email" }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update corresponding score record in Score table if it has a userName field
    const scoreUpdateFields = {
      ...(name && { userName: name }),
      ...(newEmail && { userEmail: newEmail }),
    };

    if (Object.keys(scoreUpdateFields).length > 0) {
      await Score.findOneAndUpdate({ userEmail: email }, scoreUpdateFields, {
        new: true,
      });
    }

    return NextResponse.json({
      updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating profile" },
      { status: 500 }
    );
  }
}
