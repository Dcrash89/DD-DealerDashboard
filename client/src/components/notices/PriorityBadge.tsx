
import React from 'react';
import { NoticePriority } from '../../types';

interface PriorityBadgeProps {
  priority: NoticePriority;
  t: (key: string) => string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, t }) => {
  const priorityStyles: Record<NoticePriority, string> = {
    [NoticePriority.HIGH]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-300/50',
    [NoticePriority.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-300/50',
    [NoticePriority.LOW]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-300/50',
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-bold rounded-full inline-block ${priorityStyles[priority]}`}
    >
      {t(priority)}
    </span>
  );
};

export default PriorityBadge;
