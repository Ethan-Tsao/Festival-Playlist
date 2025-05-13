'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full px-6 py-4 bg-gray-900 text-white flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
        Festival Playlist
        </Link>

        {/* add dashboard button in if my email is authenticated */}
        {session?.user?.email === 'ethanotsao@gmail.com' && (
            <Link href="/dashboard" className="hover:underline">
                Dashboard
            </Link>
        )}

        <div className="flex items-center gap-4">
        {session ? (
            <>
            <span className="text-sm hidden sm:inline">
                {session.user?.name}
            </span>
            <button
                onClick={() => signOut()}
                className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200"
            >
                Sign out
            </button>
            </>
        ) : (
            <button
            onClick={() => signIn()}
            className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200"
            >
            Sign in
            </button>
        )}
        </div>
    </nav>
  );
}
