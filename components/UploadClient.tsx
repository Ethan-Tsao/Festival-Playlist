'use client';

import { useState } from 'react';
import { savePoster, checkFestivalExists } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export default function UploadClient() {
  const [festivalName, setFestivalName] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [artistList, setArtistList] = useState<string[] | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    const filePath = `${Date.now()}-${file.name}`;
    const { data, error: uploadError } = await supabase.storage
      .from('festival-posters')
      .upload(filePath, file);

    if (uploadError) {
      setError('Upload failed. Please try again.');
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('festival-posters')
      .getPublicUrl(filePath);

    setUploadedUrl(publicUrlData.publicUrl);
  };

  const handleSubmit = async () => {
    if (!festivalName.trim()) {
      setError('Please enter a festival name.');
      return;
    }

    if (!uploadedUrl) {
      setError('Please upload a poster image first.');
      return;
    }

    const exists = await checkFestivalExists(festivalName.trim().toLowerCase());
    if (exists) {
      setError(`A festival named "${festivalName}" already exists.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadedUrl }),
      });

    const { result } = await res.json();

    let parsed: string[];

    try {
      let cleaned = result.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsedResult = JSON.parse(cleaned);

      parsed = Array.isArray(parsedResult)
        ? parsedResult.map((name: string) =>
            name.replace(/^"(.*)"$/, '$1').trim()
          )
        : [String(parsedResult).replace(/^"(.*)"$/, '$1').trim()];

      setArtistList(parsed);
    } catch {
      parsed = [result];
      setArtistList(result);
    }


      await savePoster({
        imageUrl: uploadedUrl,
        artists: parsed,
        festivalName,
      });

    } catch (err) {
      setError('Failed to extract artist names.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Upload a Festival Poster</h1>
        <p className="text-gray-600">Give your festival a name and upload the lineup image. Click submit to extract artist names.</p>

        <div className="space-y-4">
          <label className="block font-medium">
            Festival Name
            <input
              type="text"
              value={festivalName}
              onChange={(e) => setFestivalName(e.target.value)}
              placeholder="e.g. EDC Las Vegas 2024"
              className="w-full mt-1 p-2 border rounded"
            />
          </label>

          <label
            htmlFor="poster-upload"
            className="block w-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition rounded p-6 text-center text-sm text-gray-600"
          >
            Click to browse or drag & drop a poster image
            <input
              id="poster-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
          </label>


          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Extracting Artists...' : 'Submit'}
          </button>
        </div>

        {uploadedUrl && !artistList && (
          <img src={uploadedUrl} alt="Uploaded poster" className="w-full rounded shadow" />
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
      </div>

      <div>
        {uploadedUrl && artistList && (
          <div className="mt-10">
            <div className="flex flex-col md:flex-row gap-6 mx-auto">
              <div className="w-full md:w-1/2">
                <img
                  src={uploadedUrl}
                  alt="Uploaded poster"
                  className="w-full rounded shadow object-contain"
                />
              </div>

              <div className="w-full md:w-1/2 overflow-auto">
                <h2 className="text-lg font-semibold mb-2">Artists</h2>
                {Array.isArray(artistList) ? (
                  <div className="text-sm leading-relaxed grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 list-disc list-inside">
                    {artistList.map((artist, i) => (
                      <span key={i} className="whitespace-nowrap">{artist}</span>
                    ))}
                  </div>
                ) : (
                  <pre className="p-2 rounded text-sm whitespace-pre-wrap">
                    {artistList}
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
