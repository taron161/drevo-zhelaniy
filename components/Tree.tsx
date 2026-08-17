'use client';

import { useState, useEffect } from 'react';

export default function Tree() {
  const [waterLevel, setWaterLevel] = useState(0);
  const [growthStage, setGrowthStage] = useState(1);
  const [isWatering, setIsWatering] = useState(false);
  const [message, setMessage] = useState('');

  const treeStages = [
    { emoji: '🌱', name: 'Семя' },
    { emoji: '🌿', name: 'Росток' },
    { emoji: '🪴', name: 'Растение' },
    { emoji: '🌳', name: 'Дерево' },
    { emoji: '🌲', name: 'Могучее дерево' },
  ];

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
      setIsWatering(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-8">
      {/* Дерево в горшке */}
      <div className="flex flex-col items-center">
        <div className="text-6xl sm:text-8xl md:text-9xl animate-bounce-slow transition-all duration-500 select-none">
          {treeStages[growthStage - 1].emoji}
        </div>
        {/* Горшок */}
        <div className="w-20 h-16 sm:w-28 sm:h-20 bg-gradient-to-b from-orange-400 to-orange-600 rounded-b-2xl rounded-t-sm mt-1 shadow-lg relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-3 bg-orange-500 rounded-t-lg" />
        </div>
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