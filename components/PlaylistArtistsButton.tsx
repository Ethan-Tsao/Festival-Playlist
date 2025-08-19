'use client';

import { useMemo, useState } from 'react';
import { useArtistsStore } from '@/lib/useArtistsStore';

type Playlist = { 
    id: string;
    name: string 
};

export default function PlaylistArtistsButton({
  playlists,
}: {
  playlists: Playlist[];
}) {
  const [selectedId, setSelectedId] = useState<string>(playlists[0]?.id ?? '');
  const [artists, setArtists] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const lineup = useArtistsStore(s => s.lineupArtists);
  const setPlaylistArtists = useArtistsStore(s => s.setPlaylistArtists); 
  const playlistArtists = useArtistsStore(s => s.playlistArtists); 

  const [creating, setCreating] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  async function handleClick() {
    if (!selectedId) return;
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`/api/spotify/playlists/${selectedId}/artists`);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Failed to fetch artists');
      }
      const data = await res.json();
      setPlaylistArtists(data.artists ?? []);
    } catch (e: any) {
      setErr(e.message || 'Error fetching artists');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePlaylist() {
    if (matches.length === 0) return;
    setCreating(true);
    setCreatedUrl(null);
    try {
        const res = await fetch('/api/spotify/playlists/create-from-artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            artists: matches,
            perArtist: 5,
            // playlistName: 'My Festival Mix'
            isPublic: false,
        }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setCreatedUrl(data.playlistUrl ?? null);
    } catch (e: any) {
        console.log(e)
        setErr('Failed to create playlist');
    } finally {
        setCreating(false);
    }
    }

  const matches = useMemo(() => {
    if (!playlistArtists.length || !lineup.length) return [];
    const norm = (s: string) => s.toLowerCase().trim();
    const set = new Set(playlistArtists.map(norm));
    return lineup.filter(a => set.has(norm(a)));
  }, [playlistArtists, lineup]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
        <select
          className="bg-black w-1/2 p-2 border rounded"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {playlists.map((pl) => (
            <option key={pl.id} value={pl.id}>
              {pl.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleClick}
          disabled={!selectedId || loading}
          className="px-4 py-2 border rounded shadow hover:opacity-90"
        >
          {loading ? 'Loading…' : 'List playlist artists'}
        </button>
      </div>

      {err && <div className="text-red-500 text-sm mt-2">{err}</div>}

      {/* {playlistArtists.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2 underline">
            {playlistArtists.length} artists in selected playlist
          </h4>
          <div className="text-sm grid grid-cols-2 md:grid-cols-3 gap-2">
            {playlistArtists.map((a) => (
              <span key={a} className="truncate">
                {a}
              </span>
            ))}
          </div>
        </div>
      )} */}

      {/* list matches */}
      {matches.length > 0 && (
        <div>
            <div className="mt-6">
            <h4 className="font-semibold mb-2 underline">Matches with selected festival</h4>
            <div className="flex flex-wrap gap-2 text-sm">
                {matches.map((match) => (
                <span key={match} className="px-2 py-1 rounded border">{match}</span>
                ))}
            </div>
            </div>
            <div className="mt-4 flex gap-3 items-center">
            <button
                onClick={handleCreatePlaylist}
                disabled={matches.length === 0 || creating}
                className="px-4 py-2 border rounded shadow hover:opacity-90"
            >
                {creating ? 'Creating…' : `Create playlist from ${matches.length} artists`}
            </button>

            {createdUrl && (
                <a
                href={createdUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline"
                >
                Open in Spotify
                </a>
            )}
        </div>
      </div>
      )}

      
    </div>
  );
}
