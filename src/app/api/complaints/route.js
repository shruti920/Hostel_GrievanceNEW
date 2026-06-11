import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authConfig } from "@/lib/auth";
import { getUserByEmail } from "@/lib/users";
import { getHostelById } from "@/lib/hostels";
import { createComplaint } from "@/lib/complaints";
import { generateComplaintCode } from "@/lib/generateComplaintCode";

export async function POST(request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserByEmail(
      session.user.email
    );

    const hostel = await getHostelById(
      user.hostel_id
    );

    const {
      category,
      title,
      description,
      imageUrl,
    } = await request.json();

    const complaint = await createComplaint({
      complaint_code: generateComplaintCode(
        hostel.code
      ),

      student_id: user.id,

      hostel_id: user.hostel_id,

      block: user.block,
      room_number: user.room_number,

      category,
      title,
      description,

      image_url: imageUrl,

      status: "Pending",
    });

    return NextResponse.json(complaint);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create complaint" },
      { status: 500 }
    );
  }
}