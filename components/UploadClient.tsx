'use client';

import { useState } from 'react';
import UploadForm from './UploadForm';

export default function UploadClient() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  return (
    <div>
      <UploadForm onUploadComplete={setUploadedUrl} />
      {uploadedUrl && (
        <div className="mt-6">
          <p className="mb-2">Uploaded image preview:</p>
          <img src={uploadedUrl} alt="Uploaded poster" className="w-full rounded shadow" />
        </div>
      )}
    </div>
  );
}
