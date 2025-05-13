'use client';

import { useState } from 'react';

type Poster = {
  id: string;
  festival_name: string;
  image_url: string;
  artists: string[] | string;
  created_at: string;
};

export default function FestivalViewer({ posters }: { posters: Poster[] }) {
  const [selectedId, setSelectedId] = useState<string>(posters[0]?.id || '');

  const selected = posters.find((p) => p.id === selectedId);

  return (
    <div className="space-y-6">
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {posters.map((poster) => (
          <option key={poster.id} value={poster.id}>
            {poster.festival_name || 'Unnamed Festival'}
          </option>
        ))}
      </select>

      {selected && (
        <>
          <img
            src={selected.image_url}
            alt={selected.festival_name}
            className="rounded shadow w-full"
          />

          <div>
            <h2 className="text-lg font-semibold mb-2">Detected Artists</h2>
            {Array.isArray(selected.artists) ? (
              <ul className="list-disc list-inside">
                {selected.artists.map((artist, i) => (
                  <li key={i}>{artist}</li>
                ))}
              </ul>
            ) : (
              <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
                {selected.artists}
              </pre>
            )}
          </div>
        </>
      )}
    </div>
  );
}
