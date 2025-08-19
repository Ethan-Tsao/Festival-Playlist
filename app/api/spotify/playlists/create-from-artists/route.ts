import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

type PostBody = {
  artists: string[];             
  perArtist?: number;            
  playlistName?: string;         
  isPublic?: boolean;            
};

const SPOTIFY = 'https://api.spotify.com/v1';

async function sGET<T>(url: string, access: string) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${access}` } });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`GET ${url} -> ${res.status}: ${t}`);
  }
  return res.json() as Promise<T>;
}

async function sPOST<T>(url: string, access: string, body: any) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${access}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${url} -> ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const access = (token as any)?.spotifyAccessToken as string | undefined;
  if (!access) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { artists, perArtist = 5, playlistName, isPublic = false } = (await req.json()) as PostBody;
  if (!artists?.length) return NextResponse.json({ error: 'No artists provided' }, { status: 400 });

  const me = await sGET<{ id: string }>(`${SPOTIFY}/me`, access);

  const name = playlistName ?? `Festival Mix — ${new Date().toLocaleDateString()}`;
  const playlist = await sPOST<{ id: string; external_urls: { spotify?: string } }>(
    `${SPOTIFY}/users/${me.id}/playlists`,
    access,
    {
      name,
      description: 'Auto-created from lineup/playlist artist matches',
      public: isPublic,
    }
  );

  // get uri's for the top 5 songs per artist
  const trackUris: string[] = [];
  for (const rawName of artists) {
    const q = encodeURIComponent(rawName);
    const search = await sGET<{
      artists: { items: Array<{ id: string; name: string }> };
    }>(`${SPOTIFY}/search?type=artist&limit=5&q=${q}`, access);

    const items = search.artists?.items ?? [];
    if (!items.length) continue;

    const exact = items.find(a => a.name.toLowerCase() === rawName.toLowerCase()) ?? items[0];
    if (!exact?.id) continue;

    const tops = await sGET<{ tracks: Array<{ uri: string }> }>(
      `${SPOTIFY}/artists/${exact.id}/top-tracks?market=from_token`,
      access
    );
    for (const t of tops.tracks.slice(0, perArtist)) {
      if (t?.uri) trackUris.push(t.uri);
    }
  }

  // dedupe and batches of 100
  const deduped = Array.from(new Set(trackUris));
  for (let i = 0; i < deduped.length; i += 100) {
    const chunk = deduped.slice(i, i + 100);
    await sPOST(`${SPOTIFY}/playlists/${playlist.id}/tracks`, access, { uris: chunk });
  }

  return NextResponse.json({
    playlistId: playlist.id,
    playlistUrl: playlist.external_urls?.spotify ?? null,
    added: deduped.length,
  });
}
