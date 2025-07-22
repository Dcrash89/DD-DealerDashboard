import React, { useMemo } from 'react';
import { WidgetConfig, FormSubmission, Dealer } from '../../../types';
import { Icon } from '../../ui/Icon';

interface StatCardWidgetProps {
  config: WidgetConfig;
  submissions: FormSubmission[];
  dealers: Dealer[];
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const StatCardWidget: React.FC<StatCardWidgetProps> = ({ config, submissions, dealers, t }) => {
  const { value, iconName } = useMemo(() => {
    if (config.formId) {
      // Calculate total submissions for a specific form
      const count = submissions.filter(s => s.formId === config.formId).length;
      return { value: count.toString(), iconName: 'forms' };
    }
    
    // Default case: Total Dealers
    return { value: dealers.length.toString(), iconName: 'dealers' };

  }, [config, submissions, dealers]);

  return (
    <div className="flex items-center space-x-4 p-2">
      <div className="p-3 bg-dji-blue/10 dark:bg-dji-blue/20 rounded-full text-dji-blue dark:text-blue-300">
        <Icon name={iconName} className="w-8 h-8"/>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t(config.title) || config.title}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCardWidget;