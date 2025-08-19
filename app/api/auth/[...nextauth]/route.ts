// app/api/auth/[...nextauth]/route.ts
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import authOptions from '@/lib/auth';

const handler = NextAuth(authOptions);

// match Next’s (req, { params }) signature
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<Record<string, string>> }
) {
  await ctx.params; // required by types
  return handler(req);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<Record<string, string>> }
) {
  await ctx.params;
  return handler(req);
}
