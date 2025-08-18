import { NextRequest, NextResponse } from 'next/server';
import { getToken} from 'next-auth/jwt';

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const accessToken = (token as any)?.spotifyAccessToken;

    if (!accessToken) {
        return NextResponse.json({ error: 'Not authenticated with Spotify'}, {status: 401});
    }

    const res = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
        headers: {
        Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({error: text}, {status: res.status})
    }

    const data = await res.json();
    return NextResponse.json(data)
}