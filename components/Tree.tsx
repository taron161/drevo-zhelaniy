'use client';

import { useState, useEffect } from 'react';

export default function Tree() {
  const [waterLevel, setWaterLevel] = useState(0);
  const [growthStage, setGrowthStage] = useState(1);
  const [isWatering, setIsWatering] = useState(false);
  const [message, setMessage] = useState('');

  const treeStages = [
    '🌱',
    '🌿',
    '🪴',
    '🌳',
    '🌲',
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
        setMessage(`Дерево полито! Осталось ${data.balance} 💧`);
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
    <div className="flex flex-col items-center gap-8">
      <div className="text-9xl animate-bounce-slow">
        {treeStages[growthStage - 1]}
      </div>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded">
          {message}
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Уровень воды</span>
            <span className="text-gray-700">{waterLevel}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${waterLevel}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleWater(10)}
            disabled={isWatering}
            className="bg-blue-500 text-white py-3 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            💧 10%
          </button>
          <button
            onClick={() => handleWater(25)}
            disabled={isWatering}
            className="bg-green-500 text-white py-3 rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            🌊 25%
          </button>
          <button
            onClick={() => handleWater(50)}
            disabled={isWatering}
            className="bg-purple-500 text-white py-3 rounded hover:bg-purple-600 disabled:opacity-50 transition-colors"
          >
            🌧️ 50%
          </button>
        </div>
      </div>
    </div>
  );
}