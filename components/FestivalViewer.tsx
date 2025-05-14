'use client';

import { useState, useEffect } from 'react';

type Poster = {
  id: string;
  festival_name: string;
  image_url: string;
  artists: string[] | string;
  created_at: string;
};

export default function FestivalViewer({ posters }: { posters: Poster[] }) {
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    if (posters.length > 0 && !selectedId) {
      setSelectedId(posters[0].id);
    }
  }, [posters, selectedId]);

  const selected = posters.find((p) => p.id === selectedId);

  return (
    <div className="w-full px-6 max-w-screen-2xl mx-auto">
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="bg-black w-full p-2 border rounded"
      >
        {posters.map((poster) => (
          <option key={poster.id} value={poster.id}>
            {poster.festival_name || 'Unnamed Festival'}
          </option>
        ))}
      </select>

      <div>
        {selected && (
          <div className="mt-10">
            <div className="flex flex-col md:flex-row gap-6 mx-auto">
              <div className="w-full md:w-1/2">
                <img
                  src={selected.image_url}
                  alt={selected.festival_name}
                  className="w-full rounded shadow object-contain"
                />
              </div>

              <div className="w-full md:w-1/2 overflow-auto">
                <h2 className="text-lg font-semibold mb-2">Artists</h2>
                {Array.isArray(selected.artists) ? (
                  <div className="text-sm leading-relaxed grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 list-disc list-inside">
                    {selected.artists.map((artist, i) => (
                      <span key={i} className="whitespace-nowrap">{artist}</span>
                    ))}
                  </div>
                ) : (
                  <pre className="p-2 rounded text-sm whitespace-pre-wrap">
                    {selected.artists}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
