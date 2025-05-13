'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Props = {
  onUploadComplete: (publicUrl: string) => void;
};

export default function UploadForm({ onUploadComplete }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const filePath = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('festival-posters')
      .upload(filePath, file);

    if (error) {
        setError('Upload failed');
        setUploading(false);
        return;
    }

    const { data } = supabase.storage
      .from('festival-posters')
      .getPublicUrl(filePath);

    if (data?.publicUrl) {
        console.log(data.publicUrl)
        onUploadComplete(data.publicUrl);
    }

    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
      {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
