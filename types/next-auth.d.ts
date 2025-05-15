// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    spotify?: {
      accessToken: string;
      refreshToken: string;
      expires: number;
    };
  }

  interface JWT {
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
    spotifyExpires?: number;
  }
}
