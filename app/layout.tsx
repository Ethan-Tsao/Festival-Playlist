// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Festival Playlist Generator',
  description: 'Create Spotify playlists from posters',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='bg-neutral-900 text-white'>{children}</body>
    </html>
  );
}
