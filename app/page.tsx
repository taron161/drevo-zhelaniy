import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Tree from '@/components/Tree';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-800">🌳 Древо Желаний</h1>
          {session ? (
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                {session.user?.name || session.user?.email}
              </p>
              <Link 
                href="/api/auth/signout"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Выйти
              </Link>
            </div>
          ) : (
            <Link 
              href="/auth"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Войти
            </Link>
          )}
        </header>

        <Tree />
      </div>
    </main>
  );
}