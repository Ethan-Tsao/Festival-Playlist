'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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
              <div className="relative w-full" style={{ aspectRatio: '3 / 4' }}>
                <Image
                  src={selected.image_url}
                  alt={selected.festival_name}
                  fill
                  priority={selected.id === posters[0]?.id}
                  className="rounded shadow object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
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
                  <div className="p-2 rounded text-sm whitespace-pre-wrap">
                    {selected.artists}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
