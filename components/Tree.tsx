'use client';

import { useState, useEffect, useRef } from 'react';

export default function Tree() {
  const [waterLevel, setWaterLevel] = useState(0);
  const [growthStage, setGrowthStage] = useState(1);
  const [isWatering, setIsWatering] = useState(false);
  const [message, setMessage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const treeStages = [
    { name: 'Семя', height: 30 },
    { name: 'Росток', height: 60 },
    { name: 'Растение', height: 90 },
    { name: 'Дерево', height: 120 },
    { name: 'Могучее дерево', height: 150 },
  ];

  const drawTree = (stage: number, water: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Очищаем canvas
    ctx.clearRect(0, 0, width, height);

    // Горшок
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 40, height - 60);
    ctx.lineTo(width / 2 + 40, height - 60);
    ctx.lineTo(width / 2 + 30, height - 10);
    ctx.lineTo(width / 2 - 30, height - 10);
    ctx.closePath();
    ctx.fill();

    // Ободок горшка
    ctx.fillStyle = '#b45309';
    ctx.fillRect(width / 2 - 45, height - 65, 90, 10);

    const baseX = width / 2;
    const baseY = height - 70;

    if (stage === 1) {
      // Семя - просто точка в земле
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.ellipse(baseX, baseY - 5, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (stage === 2) {
      // Росток - маленький стебель
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(baseX, baseY - 30, baseX, baseY - 50);
      ctx.stroke();

      // Листики
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.ellipse(baseX - 10, baseY - 35, 10, 5, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(baseX + 10, baseY - 25, 10, 5, 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (stage === 3) {
      // Растение - толще стебель
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(baseX - 5, baseY - 40, baseX, baseY - 80);
      ctx.stroke();

      // Ветки
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY - 50);
      ctx.quadraticCurveTo(baseX - 20, baseY - 60, baseX - 30, baseY - 70);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(baseX, baseY - 40);
      ctx.quadraticCurveTo(baseX + 20, baseY - 50, baseX + 25, baseY - 60);
      ctx.stroke();

      // Листья
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(baseX - 30, baseY - 75, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(baseX + 25, baseY - 65, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(baseX, baseY - 85, 12, 0, Math.PI * 2);
      ctx.fill();
    } else if (stage === 4) {
      // Дерево - ствол и крона
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(baseX - 8, baseY - 100, 16, 100);

      // Крона
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(baseX, baseY - 110, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(baseX - 30, baseY - 90, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(baseX + 30, baseY - 90, 30, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Могучее дерево - большой ствол и крона
      ctx.fillStyle = '#654321';
      ctx.fillRect(baseX - 12, baseY - 130, 24, 130);

      // Большая крона
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(baseX, baseY - 140, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(baseX - 40, baseY - 115, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(baseX + 40, baseY - 115, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(baseX - 20, baseY - 155, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(baseX + 20, baseY - 155, 35, 0, Math.PI * 2);
      ctx.fill();
    }

    // Капли воды
    if (isWatering) {
      ctx.fillStyle = '#3b82f6';
      for (let i = 0; i < 5; i++) {
        const x = baseX + Math.random() * 40 - 20;
        const y = baseY - 100 - Math.random() * 50;
        ctx.beginPath();
        ctx.ellipse(x, y, 3, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  useEffect(() => {
    const fetchTreeState = async () => {
      try {
        const response = await fetch('/api/water');
        if (response.ok) {
          const data = await response.json();
          setWaterLevel(data.waterLevel);
          setGrowthStage(data.growthStage);
        }
      } catch (error) {
        console.error('Ошибка загрузки дерева:', error);
      }
    };

    fetchTreeState();
  }, []);

  useEffect(() => {
    drawTree(growthStage, waterLevel);
  }, [growthStage, waterLevel, isWatering]);

  const handleWater = async (amount: number) => {
    if (isWatering) return;
    setIsWatering(true);
    setMessage('');

    try {
      const response = await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, message: 'Полив дерева' }),
      });

      const data = await response.json();

      if (response.ok) {
        setWaterLevel(data.waterLevel);
        setGrowthStage(data.growthStage);
        setMessage(`Дерево растет! 💧`);
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Ошибка полива');
      }
    } catch (error) {
      console.error('Ошибка полива:', error);
      setMessage('Произошла ошибка');
    } finally {
      setTimeout(() => setIsWatering(false), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-8">
      {/* Canvas с деревом */}
      <div className="bg-gradient-to-b from-sky-100 to-green-50 rounded-lg shadow-lg p-4 sm:p-6">
        <canvas
          ref={canvasRef}
          width={300}
          height={250}
          className="w-full max-w-[300px] h-auto"
        />
      </div>

      {/* Название стадии */}
      <p className="text-sm sm:text-base text-gray-600 select-none">
        Стадия: {treeStages[growthStage - 1].name}
      </p>

      {/* Сообщение */}
      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 sm:py-3 rounded text-sm sm:text-base animate-fade-in select-none">
          {message}
        </div>
      )}

      {/* Карточка с поливом */}
      <div className="w-full max-w-[95%] sm:max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="mb-4">
          <div className="flex justify-between mb-2 text-sm sm:text-base">
            <span className="text-gray-700 select-none">Уровень воды</span>
            <span className="text-gray-700 font-semibold select-none">{waterLevel}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 sm:h-4 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, waterLevel)}%` }}
            />
          </div>
        </div>

        {/* Кнопки полива */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <button
            onClick={() => handleWater(10)}
            disabled={isWatering}
            className="bg-blue-500 text-white py-2 sm:py-3 rounded text-xs sm:text-base hover:bg-blue-600 disabled:opacity-50 transition-all active:scale-95 select-none"
          >
            💧 10%
          </button>
          <button
            onClick={() => handleWater(25)}
            disabled={isWatering}
            className="bg-green-500 text-white py-2 sm:py-3 rounded text-xs sm:text-base hover:bg-green-600 disabled:opacity-50 transition-all active:scale-95 select-none"
          >
            🌊 25%
          </button>
          <button
            onClick={() => handleWater(50)}
            disabled={isWatering}
            className="bg-purple-500 text-white py-2 sm:py-3 rounded text-xs sm:text-base hover:bg-purple-600 disabled:opacity-50 transition-all active:scale-95 select-none"
          >
            🌧️ 50%
          </button>
        </div>
      </div>
    </div>
  );
}