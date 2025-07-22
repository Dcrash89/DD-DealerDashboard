
import React from 'react';
import { UserRole } from '../../types';
import { Icon } from '../ui/Icon';
import { Dropdown } from '../ui/Dropdown';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lang: string;
  setLang: (lang: 'it' | 'en' | 'zh') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  t: (key: string) => string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, lang, setLang, userRole, setUserRole, t, onMenuClick }) => {

  const roleOptions = [
    { value: UserRole.ADMIN, label: 'Admin' },
    { value: UserRole.DEALER, label: 'Dealer' },
    { value: UserRole.GUEST, label: 'Guest' },
  ];

  const langOptions = [
    { value: 'it', label: 'Italiano' },
    { value: 'en', label: 'English' },
    { value: 'zh', label: '中文' },
  ];

  const getWelcomeMessage = () => {
    switch (userRole) {
      case UserRole.ADMIN: return t('adminWelcome');
      case UserRole.DEALER: return t('dealerWelcome');
      case UserRole.GUEST: return t('guestWelcome');
      default: return '';
    }
  };

  const getSubtitle = () => {
    switch (userRole) {
      case UserRole.ADMIN: return t('adminSubtitle');
      case UserRole.DEALER: return t('dealerSubtitle');
      case UserRole.GUEST: return t('guestSubtitle');
      default: return '';
    }
  };


  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 md:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
            <button onClick={onMenuClick} className="md:hidden p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Icon name="menu" className="w-6 h-6"/>
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{getWelcomeMessage()}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">{getSubtitle()}</p>
            </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Dropdown 
            options={roleOptions}
            selectedValue={userRole}
            onSelect={(value) => setUserRole(value as UserRole)}
          />
          <Dropdown
            options={langOptions}
            selectedValue={lang}
            onSelect={(value) => setLang(value as 'it' | 'en' | 'zh')}
            renderButton={() => <Icon name="language" className="w-5 h-5 text-gray-600 dark:text-gray-300"/>}
          />
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-dji-blue flex items-center justify-center text-white font-bold shrink-0">
            {userRole.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;