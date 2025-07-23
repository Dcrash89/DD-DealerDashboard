
import React from 'react';
import { FormStatus } from '../../types';

interface StatusBadgeProps {
  status: FormStatus;
  t: (key: string) => string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, t }) => {
  const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-full inline-block";
  const statusClasses = {
    [FormStatus.COMPLETED]: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    [FormStatus.PENDING]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    [FormStatus.ARCHIVED]: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{t(status)}</span>;
};

export default StatusBadge;
