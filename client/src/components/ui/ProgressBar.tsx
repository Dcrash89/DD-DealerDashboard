
import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const normalizedValue = Math.max(0, Math.min(value, 100));
  
  const getColor = () => {
    if (normalizedValue < 40) return 'bg-red-500';
    if (normalizedValue < 80) return 'bg-yellow-500';
    if (normalizedValue < 100) return 'bg-blue-500';
    return 'bg-green-500';
  }

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative overflow-hidden">
      <div
        className={`h-4 rounded-full transition-all duration-500 ease-out ${getColor()}`}
        style={{ width: `${normalizedValue}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-difference">
        {Math.round(normalizedValue)}%
      </span>
    </div>
  );
};

export default ProgressBar;
