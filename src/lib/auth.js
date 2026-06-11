import Google from "next-auth/providers/google";

import { STAFF_MAPPING } from "./staff-mapping";
import { getUserByEmail } from "./users";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

   session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ profile }) {
      const email = profile.email;

      return email.endsWith("@iitbbs.ac.in");
    },

    async jwt({ token, profile }) {
  if (profile?.email) {
    const user =
      await getUserByEmail(
        profile.email
      );

    if (user) {
      token.id = user.id;
    }

    const staff =
      STAFF_MAPPING[profile.email];

    if (staff) {
      token.role = staff.role;
      token.hostelCode =
        staff.hostelCode;
    } else {
      token.role = "student";
      token.hostelCode = null;
    }
  }

  return token;
},

    async session({ session, token }) {
  session.user.id =
    token.id;

  session.user.role =
    token.role;

  session.user.hostelCode =
    token.hostelCode;

  return session;
}
  },
};