// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ Named exports for GET and POST (App Router requirement)
const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;
