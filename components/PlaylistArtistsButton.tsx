'use client';

import { useState } from 'react';

type Playlist = { id: string; name: string };

export default function PlaylistArtistsButton({
  playlists,
}: {
  playlists: Playlist[];
}) {
  const [selectedId, setSelectedId] = useState<string>(playlists[0]?.id ?? '');
  const [artists, setArtists] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleClick() {
    if (!selectedId) return;
    setLoading(true);
    setErr(null);
    setArtists([]);
    try {
      const res = await fetch(`/api/spotify/playlists/${selectedId}/artists`);
      if (!res.ok) {
        const t = await res.text().catch(() => '');
        throw new Error(t || 'Failed to fetch artists');
      }
      const data = await res.json();
      setArtists(data.artists ?? []);
    } catch (e: any) {
      setErr(e.message || 'Error fetching artists');
    } finally {
      setLoading(false);
    }
  }

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

      {artists.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-sm opacity-80">
            {artists.length} artists in selected playlist
          </h4>
          <div className="text-sm grid grid-cols-2 md:grid-cols-3 gap-2">
            {artists.map((a) => (
              <span key={a} className="truncate">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
