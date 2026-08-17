import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const { amount, message } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Создаем запись о поливе
    await prisma.water.create({
      data: {
        amount,
        message,
        userId: user.id,
      },
    });

    // Обновляем состояние дерева
    let treeState = await prisma.treeState.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    
    const newWaterLevel = (treeState?.waterLevel || 0) + amount;
    const newGrowthStage = Math.min(5, Math.floor(newWaterLevel / 20) + 1);

    if (treeState) {
      treeState = await prisma.treeState.update({
        where: { id: treeState.id },
        data: {
          waterLevel: newWaterLevel,
          growthStage: newGrowthStage,
        },
      });
    } else {
      treeState = await prisma.treeState.create({
        data: {
          waterLevel: newWaterLevel,
          growthStage: newGrowthStage,
        },
      });
    }

    return NextResponse.json({
      success: true,
      balance: user.balance,
      waterLevel: treeState.waterLevel,
      growthStage: treeState.growthStage,
    });
  } catch (error) {
    console.error('Ошибка полива:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const treeState = await prisma.treeState.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
    
    return NextResponse.json({
      waterLevel: treeState?.waterLevel || 0,
      growthStage: treeState?.growthStage || 1,
    });
  } catch (error) {
    console.error('Ошибка получения состояния дерева:', error);
    return NextResponse.json(
      { 
        waterLevel: 0,
        growthStage: 1,
      },
      { status: 200 }
    );
  }
}