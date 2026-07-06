import NextAuth from "next-auth";

// TODO: Add auth providers (Google, email magic link, credentials)
// See AGENT.md — open question: auth provider preference
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [],
  pages: {
    signIn: "/onboarding",
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
