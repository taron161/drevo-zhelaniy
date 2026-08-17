import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      waters: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      donations: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!user) {
    redirect('/auth');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <header className="flex items-center justify-between gap-2 mb-6 sm:mb-8">
          <Link href="/" className="text-lg sm:text-3xl font-bold text-green-800 whitespace-nowrap">
            🌳 Древо Желаний
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link 
              href="/"
              className="text-green-600 hover:text-green-700 text-sm sm:text-base whitespace-nowrap"
            >
              На главную
            </Link>
            <Link 
              href="/api/auth/signout"
              className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm hover:bg-red-600 transition-colors whitespace-nowrap"
            >
              Выйти
            </Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto">
          {/* Профиль */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl sm:text-3xl">
                👤
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {user.name || 'Пользователь'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-green-50 p-3 sm:p-4 rounded">
                <p className="text-xs sm:text-sm text-gray-500">Баланс</p>
                <p className="text-lg sm:text-xl font-bold text-green-600">
                  {user.balance} 💧
                </p>
              </div>
              <div className="bg-blue-50 p-3 sm:p-4 rounded">
                <p className="text-xs sm:text-sm text-gray-500">Поливов</p>
                <p className="text-lg sm:text-xl font-bold text-blue-600">
                  {user.waters.length} 🌊
                </p>
              </div>
            </div>
          </div>

          {/* История поливов */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Последние поливы
            </h3>
            
            {user.waters.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-400 text-center py-4">
                Пока нет поливов
              </p>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {user.waters.map((water) => (
                  <div 
                    key={water.id}
                    className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700">
                        💧 {water.amount}%
                      </p>
                      {water.message && (
                        <p className="text-xs text-gray-400">{water.message}</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(water.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}