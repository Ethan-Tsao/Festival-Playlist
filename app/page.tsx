import UploadClient from '@/components/UploadClient';
import AuthLayout from '@/components/AuthLayout';
import { supabase } from '@/lib/supabase';
import FestivalViewer from '@/components/FestivalViewer';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PlaylistArtistsButton from '@/components/PlaylistArtistsButton';

export default async function Home() {

  const { data: posters, error } = await supabase
    .from('posters')
    .select('*')
    .order('created_at', { ascending: false});

  if (error) {
    console.error('Error loading posters:', error.message);
    return <p className="p-6 text-red-600"></p>
  }

  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.spotify?.accessToken;
  
  // if (!accessToken) {
  //   return <div>Please sign in with Spotify</div>;
  // }

  const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  // if (!res.ok) {
  //   return <div>Failed to load playlists</div>;
  // }
  
  const data = await res.json();
  const playlists = data.items || [];

  return (
    <AuthLayout>
      <>
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-center">Browse Festival Posters</h1>
        </div>
        <div className="mx-auto p-6">
          <div className="w-full px-6 max-w-screen-2xl mx-auto mb-4">
          <h1 className="text-2xl font-bold mb-4">Your Spotify Playlists</h1>
          {accessToken ? (
            <PlaylistArtistsButton playlists={playlists} />
            // <div>
            //   <select className="bg-black w-1/2 p-2 border rounded mb-4">
            //     {playlists.map((pl: any) => (
            //       <option key={pl.id} className="pb-1">
            //         {pl.name}
            //       </option>
            //     ))}
            //   </select>
            // </div>
          ) : (<div className='mb-4'>Please sign in with Spotify to see playlists</div>)
          }
        <h1 className="text-2xl font-bold mb-4">Festivals</h1>
        </div>
          <FestivalViewer posters={posters} />
        </div>
      </>
    </AuthLayout>
  );
}
