'use client';

import { useState, useEffect } from 'react';

export default function Tree() {
  const [waterLevel, setWaterLevel] = useState(0);
  const [growthStage, setGrowthStage] = useState(1);
  const [isWatering, setIsWatering] = useState(false);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const treeStages = [
    '🌱',
    '🌿',
    '🪴',
    '🌳',
    '🌲',
  ];

  useEffect(() => {
    // Проверяем мобильное устройство
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

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

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
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
        setMessage(`Дерево полито! Осталось ${data.balance} 💧`);
        
        // Автоматически скрываем сообщение через 3 секунды
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
      {/* Дерево */}
      <div className={`${isMobile ? 'text-6xl' : 'text-8xl md:text-9xl'} animate-bounce-slow transition-all duration-300`}>
        {treeStages[growthStage - 1]}
      </div>

      {/* Сообщение */}
      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 sm:py-3 rounded text-sm sm:text-base animate-fade-in">
          {message}
        </div>
      )}

      {/* Карточка с поливом */}
      <div className="w-full max-w-[95%] sm:max-w-md bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="mb-4">
          <div className="flex justify-between mb-2 text-sm sm:text-base">
            <span className="text-gray-700">Уровень воды</span>
            <span className="text-gray-700 font-semibold">{waterLevel}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 sm:h-4 rounded-full transition-all duration-500"
              style={{ width: `${waterLevel}%` }}
            />
          </div>
        </div>

        {/* Кнопки полива */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <button
            onClick={() => handleWater(10)}
            disabled={isWatering}
            className="bg-blue-500 text-white py-2 sm:py-3 rounded text-xs sm:text-base hover:bg-blue-600 disabled:opacity-50 transition-all active:scale-95"
          >
            💧 10%
          </button>
          <button
            onClick={() => handleWater(25)}
            disabled={isWatering}
            className="bg-green-500 text-white py-2 sm:py-3 rounded text-xs sm:text-base hover:bg-green-600 disabled:opacity-50 transition-all active:scale-95"
          >
            🌊 25%
          </button>
          <button
            onClick={() => handleWater(50)}
            disabled={isWatering}
            className="bg-purple-500 text-white py-2 sm:py-3 rounded text-xs sm:text-base hover:bg-purple-600 disabled:opacity-50 transition-all active:scale-95"
          >
            🌧️ 50%
          </button>
        </div>
      </div>
    </div>
  );
}