import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authConfig } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      hostelId,
      block,
      roomNumber,
    } = await request.json();

    const { error } = await supabaseAdmin
      .from("users")
      .update({
        hostel_id: Number(hostelId),
        block,
        room_number: roomNumber,
      })
      .eq("email", session.user.email);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to register hostel" },
      { status: 500 }
    );
  }
}