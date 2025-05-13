import UploadClient from '@/components/UploadClient';
import AuthLayout from '@/components/AuthLayout';
import { supabase } from '@/lib/supabase';
import FestivalViewer from '@/components/FestivalViewer';

export default async function Home() {
  const { data: posters, error } = await supabase
    .from('posters')
    .select('*')
    .order('created_at', { ascending: false});

  if (error) {
    console.error('Error loading posters:', error.message);
    return <p className="p-6 text-red-600"></p>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Festival Posters</h1>
      <FestivalViewer posters={posters} />
    </div>
  );
}
