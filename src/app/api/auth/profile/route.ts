import { NextResponse } from "next/server";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";

export async function PUT(request: Request) {
  try {
    await connectToDatabase();

    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.name = name;
    await user.save();

    return NextResponse.json(
      {
        message: "User name updated successfully",
        updatedUser: { email: user.email, name: user.name }, // Return updated data
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
