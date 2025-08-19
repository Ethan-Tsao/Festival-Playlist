import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import SpotifyProvider from 'next-auth/providers/spotify';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            'user-read-email playlist-read-private playlist-modify-public playlist-modify-private',
        },
      },
    }),
  ],
  callbacks: {
    // persist the OAuth tokens in the JWT
    async jwt({ token, account }) {
      if (account?.provider === 'spotify') {
        token.spotifyAccessToken = account.access_token;
        token.spotifyRefreshToken = account.refresh_token;
        token.spotifyExpires = account.expires_at;
      }
      return token;
    },
    // make tokens available in the session object
    async session({ session, token }) {
      session.user = session.user || {};
      if (token.spotifyAccessToken) {
        session.spotify = {
          accessToken: token.spotifyAccessToken as string,
          refreshToken: token.spotifyRefreshToken as string,
          expires: token.spotifyExpires as number,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;
