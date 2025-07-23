
import React from 'react';

interface ValueBadgeProps {
  value: string;
}

const COLORS = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
  'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
];

// Simple hash function to get a consistent color for a string
const stringToHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const ValueBadge: React.FC<ValueBadgeProps> = ({ value }) => {
  if (!value) return <span>-</span>;
  
  const colorIndex = stringToHash(value) % COLORS.length;
  const colorClasses = COLORS[colorIndex];

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-block ${colorClasses}`}>
      {value}
    </span>
  );
};

export default ValueBadge;
