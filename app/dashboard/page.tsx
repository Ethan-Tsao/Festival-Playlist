import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import UploadClient from '@/components/UploadClient';
import AuthLayout from '@/components/AuthLayout';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  console.log(session?.user?.email)

  // Restrict access to only your GitHub or Google email
  if (!session || session.user?.email !== 'ethanotsao@gmail.com') {
    redirect('/');
  }

  return (
    <AuthLayout>
        <main className="p-6 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Upload Festival Lineup Poster</h1>
                <UploadClient />
              </main>
    </AuthLayout>
  );
}
