'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        // Успешная регистрация - сразу входим
        await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Неверный email или пароль');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-[95%] sm:max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-green-800">
          {isLogin ? '🌳 Вход' : '🌱 Регистрация'}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 sm:p-3 rounded mb-4 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-3 sm:space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">
                Имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                placeholder="Ваше имя (необязательно)"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 sm:p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
              required
              placeholder="Минимум 6 символов"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 sm:py-3 rounded text-sm sm:text-base hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="w-full text-center mt-3 sm:mt-4 text-green-600 hover:text-green-700 text-sm sm:text-base"
        >
          {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
        </button>
      </div>
    </div>
  );
}