import UploadClient from '@/components/UploadClient';
import AuthLayout from '@/components/AuthLayout';

export default function Home() {
  return (
    <AuthLayout>
      <main className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Upload Festival Lineup Poster</h1>
        <UploadClient />
      </main>
    </AuthLayout>
  );
}
