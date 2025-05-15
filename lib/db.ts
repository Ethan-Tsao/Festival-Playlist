import { supabase } from './supabase';

export async function savePoster({ imageUrl, artists, festivalName }: {
  imageUrl: string;
  artists: string[]; 
  festivalName: string;
}) {
  const { data, error } = await supabase
    .from('posters')
    .insert([{ image_url: imageUrl, artists, festival_name: festivalName }]);

  if (error) throw error;
  return data;
}

export async function checkFestivalExists(festivalName: string) {
    const {data, error} = await supabase
        .from('posters')
        .select('id')
        .ilike('festival_name', festivalName);

    if (error) throw error;
    return data.length > 0
}

