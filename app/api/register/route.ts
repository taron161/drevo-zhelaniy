import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  console.log('Начало регистрации');
  
  try {
    const body = await request.json();
    console.log('Получены данные:', body);
    
    const { email, password, name } = body;

    // Проверяем существование
    console.log('Проверяем пользователя...');
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    console.log('Существующий пользователь:', existingUser);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      );
    }

    // Хешируем пароль
    console.log('Хешируем пароль...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    console.log('Создаем пользователя...');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        balance: 100,
      },
    });
    console.log('Пользователь создан:', user);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance,
      },
    });
  } catch (error) {
    console.error('ОШИБКА РЕГИСТРАЦИИ:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера: ' + (error as Error).message },
      { status: 500 }
    );
  }
}