import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authConfig } from "@/lib/auth";
import { updateComplaintStatus } from "@/lib/complaints";

import { getComplaintById } from "@/lib/complaints";
import { getHostelByCode } from "@/lib/hostels";

export async function PATCH(request) {
  try {
    const session = await getServerSession(authConfig);

    if (
      !session ||
      session.user.role !== "hall_office"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      complaintId,
      status,
    } = await request.json();

    const existingComplaint =
  await getComplaintById(
    complaintId
  );

const hallHostel =
  await getHostelByCode(
    session.user.hostelCode
  );

if (
  existingComplaint.hostel_id !==
  hallHostel.id
) {
  return NextResponse.json(
    {
      error:
        "Cannot update another hostel's complaint",
    },
    {
      status: 403,
    }
  );
}

    const updatedComplaint =
      await updateComplaintStatus(
        complaintId,
        status
      );

    return NextResponse.json(updatedComplaint);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}