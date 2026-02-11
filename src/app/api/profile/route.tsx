import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "No token provided" }, { status: 403 });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 403 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("Token verified, decoded payload:", decoded);
    return NextResponse.json({
      message: "Access granted",
      user: decoded,
    });
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
