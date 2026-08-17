import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Link href="/auth" className="text-green-600 text-xl">
          Войдите в систему
        </Link>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Link href="/auth" className="text-green-600 text-xl">
          Войдите в систему
        </Link>
      </main>
    );
  }

  const waters = await prisma.water.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">🌳 Профиль</h1>
          <div className="flex gap-4">
            <Link href="/" className="text-green-600">
              На главную
            </Link>
            <Link href="/api/auth/signout" className="text-red-500">
              Выйти
            </Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">{user.name || 'Пользователь'}</h2>
            <p className="text-gray-500 mb-4">{user.email}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded">
                <p className="text-gray-500">Баланс</p>
                <p className="text-2xl font-bold text-green-600">{user.balance} 💧</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-gray-500">Поливов</p>
                <p className="text-2xl font-bold text-blue-600">{waters.length} 🌊</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Последние поливы</h3>
            {waters.length === 0 ? (
              <p className="text-gray-400 text-center">Пока нет поливов</p>
            ) : (
              <div className="space-y-3">
                {waters.map((water) => (
                  <div key={water.id} className="flex justify-between p-3 bg-gray-50 rounded">
                    <span>💧 {water.amount}%</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(water.createdAt).toLocaleDateString('ru-RU')}
                    </span>
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