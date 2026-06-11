import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authConfig } from "@/lib/auth";
import { createUserIfMissing } from "@/lib/users";
import { getDashboardRoute } from "@/lib/dashboardRoute";

export default async function DashboardPage() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/login");
  }

  const dashboardRoute = getDashboardRoute(session.user.role);

  const user = await createUserIfMissing({
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  });

  // Staff
  if (user.role === "hall_office") {
    redirect("/hall-office");
  }

  if (user.role === "warden") {
    redirect("/warden");
  }

  if (user.role === "chief_warden") {
    redirect("/chief-warden");
  }

  // Student
  const hostelRegistered =
    user.hostel_id !== null &&
    user.block !== null &&
    user.room_number !== null;

  if (!hostelRegistered) {
    redirect("/register-hostel");
  }

  redirect("/student");
}