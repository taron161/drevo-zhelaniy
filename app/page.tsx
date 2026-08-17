import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Tree from '@/components/Tree';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 text-center sm:text-left">
            🌳 Древо Желаний
          </h1>
          
          {session ? (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-right">
                <p className="text-xs sm:text-sm text-gray-600">
                  {session.user?.name || session.user?.email}
                </p>
              </div>
              <Link 
                href="/api/auth/signout"
                className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base hover:bg-red-600 transition-colors"
              >
                Выйти
              </Link>
            </div>
          ) : (
            <Link 
              href="/auth"
              className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded text-sm sm:text-base hover:bg-green-700 transition-colors"
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