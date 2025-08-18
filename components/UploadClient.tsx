'use client';

import { useState } from 'react';
import { savePoster, checkFestivalExists } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export default function UploadClient() {
  const [festivalName, setFestivalName] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [artistList, setArtistList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [poster, setPoster] = useState(false);


  // upload to supabase and load the poster image
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

  const handleSavePoster = async () => {
    // if you try to submit without a festival name
    if (!festivalName.trim()) {
      setError('Please enter a festival name.');
      return;
    }

    // if you try to submit without uploading an image
    if (!uploadedUrl) {
      setError('Please upload a poster image first.');
      return;
    }

    // checks for duplicate festivals
    const exists = await checkFestivalExists(festivalName.trim().toLowerCase());
    if (exists) {
      setError(`A festival named "${festivalName}" already exists.`);
      return;
    }

    try {
      await savePoster({
        imageUrl: uploadedUrl!,
        artists: artistList,
        festivalName,
      });
      setError(null);
      setSuccess('Poster and artist list saves successfully!')
    } catch (err) {
      setError('Failed to save poster.');
      console.error(err);
    }
  };


  const handleSubmit = async () => {



    setLoading(true);
    setError(null);

    // OpenAI api call
    try {
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadedUrl }),
      });

      const { result } = await res.json();

      console.log(result)

      let parsedResult = JSON.parse(result);

      try {
        parsedResult = Array.isArray(parsedResult)
          ? parsedResult.map((name: string) => name.replace(/^"(.*)"$/, '$1').trim())
          : [String(parsedResult).replace(/^"(.*)"$/, '$1').trim()];

        setArtistList(parsedResult);
      } catch {
        parsedResult = [result];
        setArtistList(result);
      }


    console.log(parsedResult)

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
            className="block w-full cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition rounded p-6 text-center text-lg text-gray-100"
          >
            {poster ? 'Poster Loaded' : 'Click to browse'}
            <input
              id="poster-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setPoster(true);
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
          </label>


          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold transition transform disabled:opacity-50 text-lg cursor-pointer active:translate-y-[2px] active:shadow-inner "
          >
            {loading ? 'Extracting Artists...' : 'Submit'}
          </button>
        </div>

        {success && (
          <div className="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded">
            {success}
          </div>
        )}


        {uploadedUrl && !artistList && (
          <img src={uploadedUrl} alt="Uploaded poster" className="w-full rounded shadow" />
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
      </div>

      {uploadedUrl && artistList.length > 0 && (
        <div className="mt-10 flex flex-col md:flex-row gap-6 mx-auto">
          <div className="w-full md:w-1/2">
            <img
              src={uploadedUrl}
              alt="Uploaded poster"
              className="w-full rounded shadow object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Review and Edit Artists</h2>
            <textarea
              value={artistList.join('\n')}
              onChange={(e) =>
                setArtistList(
                  e.target.value
                    .split('\n')
                    .map((line) => line.trim())
                    .filter(Boolean)
                )
              }
              className="w-full h-128 border rounded p-2 text-sm font-mono"
            />

            <button
              onClick={handleSavePoster}
              disabled={loading}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold"
            >
              Save to Database
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
