// lib/db.ts
import { supabase } from './supabase';

export async function savePoster({ imageUrl, artists }: {
  imageUrl: string;
  artists: string[]; 
}) {
  const { data, error } = await supabase
    .from('posters')
    .insert([{ image_url: imageUrl, artists }]);

  if (error) throw error;
  return data;
}
