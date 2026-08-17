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

    if (user.balance < amount) {
      return NextResponse.json(
        { error: 'Недостаточно средств' },
        { status: 400 }
      );
    }

    const [updatedUser, waterRecord] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: amount } },
      }),
      prisma.water.create({
        data: {
          amount,
          message,
          userId: user.id,
        },
      }),
    ]);

    let treeState = await prisma.treeState.findFirst();
    
    const newWaterLevel = Math.min(100, (treeState?.waterLevel || 0) + amount);
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
      balance: updatedUser.balance,
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
    const treeState = await prisma.treeState.findFirst();
    
    return NextResponse.json({
      waterLevel: treeState?.waterLevel || 0,
      growthStage: treeState?.growthStage || 1,
    });
  } catch (error) {
    console.error('Ошибка получения состояния дерева:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}