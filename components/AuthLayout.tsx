'use client';

import { SessionProvider } from 'next-auth/react';
import Navbar from './Navbar';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Navbar />
      <main className="p-6">{children}</main>
    </SessionProvider>
  );
}
