import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Tree from '@/components/Tree';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <header className="flex items-center justify-between gap-2 mb-6 sm:mb-8">
          <h1 className="text-lg sm:text-3xl md:text-4xl font-bold text-green-800 whitespace-nowrap">
            🌳 Древо Желаний
          </h1>
          
          {session ? (
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <p className="hidden sm:block text-sm text-gray-600">
                {session.user?.name || session.user?.email}
              </p>
              <Link 
                href="/api/auth/signout"
                className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-red-600 transition-colors whitespace-nowrap"
              >
                Выйти
              </Link>
            </div>
          ) : (
            <Link 
              href="/auth"
              className="bg-green-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded text-sm sm:text-base hover:bg-green-700 transition-colors whitespace-nowrap shrink-0"
            >
              Войти
            </Link>
          )}
        </header>

        <div className="animate-fade-in">
          <Tree />
        </div>
      </div>
    </main>
  );
}