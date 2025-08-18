// app/api/spotify/playlists/[id]/artists/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

type TrackItem = { track: { artists?: { name: string }[] } | null };
type Paging<T> = { items: T[]; next: string | null };

export async function GET(
    req: NextRequest, 
    context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const access = (token as any)?.spotifyAccessToken as string | undefined;
  if (!access) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const artistSet = new Set<string>();

  let res = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks?limit=100`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  let page = (await res.json()) as Paging<TrackItem>;
  for (const it of page.items) it.track?.artists?.forEach(a => a?.name && artistSet.add(a.name));

  // paginate
  while (page.next) {
    res = await fetch(page.next, { headers: { Authorization: `Bearer ${access}` }, cache: 'no-store' });
    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: txt }, { status: res.status });
    }
    page = (await res.json()) as Paging<TrackItem>;
    for (const it of page.items) it.track?.artists?.forEach(a => a?.name && artistSet.add(a.name));
  }

  const artists = Array.from(artistSet).sort((a, b) => a.localeCompare(b));
  return NextResponse.json({ count: artists.length, artists });
}
