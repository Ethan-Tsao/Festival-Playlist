'use client';

import { useState } from 'react';
import UploadForm from './UploadForm';
import { savePoster } from '@/lib/db';

export default function UploadClient() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [artistList, setArtistList] = useState<string[] | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploaded = async (url: string) => {
    setUploadedUrl(url);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url }),
      });

      const { result } = await res.json();

      let parsed: string[];
      try {
        const parsedResult = JSON.parse(result);
        parsed = Array.isArray(parsedResult) ? parsedResult : [parsedResult];
        setArtistList(parsedResult);
      } catch {
        parsed = [result]; // fallback to raw string
        setArtistList(result);
      }

      await savePoster({
        imageUrl: url,
        artists: parsed,
      });

    } catch (err) {
      setError('Failed to extract artist names.');
      console.error(err);
    } finally {
      setLoading(false);
    }

    
  };

  

  return (
    <div className="space-y-6">
      <UploadForm onUploadComplete={handleUploaded} />

      {uploadedUrl && (
        <div className="mt-6">
          <p className="mb-2 text-sm text-gray-600">Uploaded poster preview:</p>
          <img src={uploadedUrl} alt="Uploaded poster" className="w-full rounded shadow" />
        </div>
      )}

      {loading && <p className="text-blue-500">Extracting artist names...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {artistList && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Detected Artists</h2>
          {Array.isArray(artistList) ? (
            <ul className="list-disc list-inside">
              {artistList.map((artist, index) => (
                <li key={index}>{artist}</li>
              ))}
            </ul>
          ) : (
            <pre className="bg-gray-500 p-2 rounded text-sm whitespace-pre-wrap">
              {artistList}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
