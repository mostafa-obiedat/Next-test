import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDB from "@/app/lib/db";
import User from "@/app/models/User";

export async function POST(request) {
  try {
    await connectDB();

    const {
      name,
      email,
      password,
      role,
      phone,
      address,
    } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in register route:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
