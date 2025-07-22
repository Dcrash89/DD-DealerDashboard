
import React, { useRef, useEffect, useState } from 'react';
import { UserRole, AppView } from '../../types';
import { Icon } from '../ui/Icon';

interface SidebarProps {
  userRole: UserRole;
  t: (key: string) => string;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  unreadNoticesCount: number;
}

const mainNavItems: { name: AppView; labelKey: string; iconName: string; roles: UserRole[] }[] = [
  { name: 'dashboard', labelKey: 'dashboard', iconName: 'dashboard', roles: [UserRole.ADMIN, UserRole.DEALER, UserRole.GUEST] },
  { name: 'dealers', labelKey: 'dealers', iconName: 'dealers', roles: [UserRole.ADMIN] },
  { name: 'forms', labelKey: 'formTemplates', iconName: 'pencil-ruler', roles: [UserRole.ADMIN] },
  { name: 'availableForms', labelKey: 'availableForms', iconName: 'forms', roles: [UserRole.DEALER] },
  { name: 'mySubmissions', labelKey: 'mySubmissions', iconName: 'file-text', roles: [UserRole.DEALER] },
  { name: 'salesForecasts', labelKey: 'salesForecasts', iconName: 'file-bar-chart', roles: [UserRole.ADMIN, UserRole.DEALER] },
  { name: 'goals', labelKey: 'goals', iconName: 'goals', roles: [UserRole.ADMIN] },
  { name: 'myTeam', labelKey: 'myTeam', iconName: 'myTeam', roles: [UserRole.DEALER] },
  { name: 'notices', labelKey: 'notices', iconName: 'notices', roles: [UserRole.ADMIN, UserRole.DEALER] },
  { name: 'calendar', labelKey: 'calendar', iconName: 'calendar', roles: [UserRole.ADMIN, UserRole.DEALER] },
  { name: 'addressBook', labelKey: 'addressBook', iconName: 'addressBook', roles: [UserRole.ADMIN] },
];

const Sidebar: React.FC<SidebarProps> = ({ userRole, t, activeView, setActiveView, isOpen, setIsOpen, unreadNoticesCount }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const handleNavigation = (view: AppView) => {
    setActiveView(view);
    setIsOpen(false);
  };
  
  const SidebarContent = () => (
    <div className="flex flex-col flex-shrink-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full">
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-dji-blue">DJI</h1>
        <span className="text-2xl font-light text-gray-600 dark:text-gray-300 ml-2">Dealer</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {mainNavItems.map(item =>
          item.roles.includes(userRole) && (
            <button
              key={item.name}
              type="button"
              onClick={() => handleNavigation(item.name)}
              className={`flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-left ${
                activeView === item.name
                  ? 'bg-dji-blue text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center">
                <Icon name={item.iconName} className="w-5 h-5 mr-3" />
                {t(item.labelKey)}
              </div>
               {item.name === 'notices' && unreadNoticesCount > 0 && (
                 <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
               )}
            </button>
          )
        )}
      </nav>
      <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
        <button 
          type="button" 
          onClick={() => handleNavigation('settings')}
          className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-left transition-colors duration-200 ${
            activeView === 'settings'
            ? 'bg-dji-blue text-white shadow-md'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Icon name="settings" className="w-5 h-5 mr-3" />
          {t('settings')}
        </button>
      </div>
    </div>
  );


  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'bg-black/50' : 'bg-transparent pointer-events-none'}`}
           onClick={() => setIsOpen(false)}
      />
      <div ref={sidebarRef} className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
         <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
