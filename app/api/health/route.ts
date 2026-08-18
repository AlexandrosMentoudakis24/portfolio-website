import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
}