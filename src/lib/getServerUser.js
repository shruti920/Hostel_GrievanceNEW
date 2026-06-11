import { getServerSession } from "next-auth";
import { authConfig } from "./auth";
import { getUserByEmail } from "./users";

export async function getServerUser() {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    return null;
  }

  const user = await getUserByEmail(session.user.email);

  return {
    session,
    user,
  };
}