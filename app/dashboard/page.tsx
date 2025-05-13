import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Restrict access to only your GitHub or Google email
  if (!session || session.user?.email !== 'ethanotsao@email.com') {
    redirect('/');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Upload Festival Poster</h1>
      {/* UploadClient component goes here */}
    </div>
  );
}
