
import React from 'react';
import { Icon } from '../components/ui/Icon';

interface PlaceholderViewProps {
  t: (key: string) => string;
  pageName: string;
  iconName: string;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ t, pageName, iconName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
      <div className="text-dji-blue/50 dark:text-dji-blue/30">
        <Icon name={iconName} className="w-24 h-24 mb-6" />
      </div>
      <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">{t(pageName)}</h2>
      <p className="mt-2 text-lg">{t('pageUnderConstruction')}</p>
    </div>
  );
};

export default PlaceholderView;