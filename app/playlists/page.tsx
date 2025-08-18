// app/playlists/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function PlaylistsPage() {
  const session = await getServerSession(authOptions);
  const accessToken = (session as any)?.spotify?.accessToken;

  if (!accessToken) {
    return <div>Please sign in with Spotify</div>;
  }

  const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Failed to load playlists</div>;
  }

  const data = await res.json();
  const playlists = data.items || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Spotify Playlists</h1>
      <select className="bg-black w-half p-2 border rounded">
        {playlists.map((pl: any) => (
          <option key={pl.id} className="pb-1">
            {pl.name}
          </option>
        ))}
      </select>
    </div>
  );
}
