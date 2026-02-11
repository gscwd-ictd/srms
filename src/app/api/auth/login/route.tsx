import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

//sample login
const USER = {
  id: 1,
  email: "ricardovicentenarvaiza@gscwd.com",
  password: "123456",
};

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email !== USER.email || password !== USER.password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ id: USER.id, email: USER.email }, process.env.JWT_SECRET!, { expiresIn: "1h" });

  return NextResponse.json({ token });
}
