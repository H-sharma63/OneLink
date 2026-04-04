import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.onboarded) {
        token.onboarded = session.onboarded;
      }

      if (user) {
        token.id = user.id;
      }

      // Fetch username and onboarded status if missing
      if (token.username === undefined || token.onboarded === undefined) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { username: true, onboarded: true },
        });
        if (dbUser) {
          token.username = dbUser.username;
          token.onboarded = dbUser.onboarded;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string | undefined | null;
        session.user.onboarded = token.onboarded as boolean | undefined;
      }
      return session;
    },
  },
};