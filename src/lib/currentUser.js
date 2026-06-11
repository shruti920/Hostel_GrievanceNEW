import { getServerSession } from "next-auth";
import { authConfig } from "./auth";

import { getUserByEmail } from "./users";

export async function getCurrentUser() {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    return null;
  }

  return getUserByEmail(session.user.email);
}