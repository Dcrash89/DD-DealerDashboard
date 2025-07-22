import React, { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { Icon } from '../ui/Icon';

interface SidebarProps {
  t: (key: string) => string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  unreadNoticesCount: number;
}

type NavItem = { path: string; labelKey: string; iconName: string; roles: UserRole[] };

const mainNavItems: NavItem[] = [
  { path: '/', labelKey: 'dashboard', iconName: 'dashboard', roles: ['ADMIN', 'DEALER', 'GUEST'] },
  { path: '/users', labelKey: 'userManagement', iconName: 'users', roles: ['ADMIN'] },
  { path: '/dealers', labelKey: 'dealers', iconName: 'dealers', roles: ['ADMIN'] },
  { path: '/forms', labelKey: 'formTemplates', iconName: 'pencil-ruler', roles: ['ADMIN'] },
  { path: '/availableForms', labelKey: 'availableForms', iconName: 'forms', roles: ['DEALER'] },
  { path: '/mySubmissions', labelKey: 'mySubmissions', iconName: 'file-text', roles: ['DEALER'] },
  { path: '/salesForecasts', labelKey: 'salesForecasts', iconName: 'file-bar-chart', roles: ['ADMIN', 'DEALER'] },
  { path: '/goals', labelKey: 'goals', iconName: 'goals', roles: ['ADMIN'] },
  { path: '/myTeam', labelKey: 'myTeam', iconName: 'myTeam', roles: ['DEALER'] },
  { path: '/notices', labelKey: 'notices', iconName: 'notices', roles: ['ADMIN', 'DEALER'] },
  { path: '/calendar', labelKey: 'calendar', iconName: 'calendar', roles: ['ADMIN', 'DEALER'] },
  { path: '/addressBook', labelKey: 'addressBook', iconName: 'addressBook', roles: ['ADMIN'] },
];

const NavButton: React.FC<{ item: NavItem, t: (k:string)=>string, closeSidebar: ()=>void, hasBadge?: boolean}> = ({ item, t, closeSidebar, hasBadge }) => {
    return (
        <NavLink
            to={item.path}
            onClick={closeSidebar}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-left ${
                isActive
                  ? 'bg-dji-blue text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <div className="flex items-center">
              <Icon name={item.iconName} className="w-5 h-5 mr-3" />
              {t(item.labelKey)}
            </div>
            {hasBadge && (
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            )}
        </NavLink>
    );
}

const Sidebar: React.FC<SidebarProps> = ({ t, isOpen, setIsOpen, unreadNoticesCount }) => {
  const { user } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  const closeSidebar = () => setIsOpen(false);
  
  const SidebarContent = () => (
    <div className="flex flex-col flex-shrink-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full">
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-dji-blue">DJI</h1>
        <span className="text-2xl font-light text-gray-600 dark:text-gray-300 ml-2">Dealer</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {mainNavItems.map(item =>
          user && item.roles.includes(user.role) && (
            <NavButton 
                key={item.path} 
                item={item} 
                t={t} 
                closeSidebar={closeSidebar}
                hasBadge={item.path === '/notices' && unreadNoticesCount > 0}
             />
          )
        )}
      </nav>
      <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
        <NavButton 
            item={{ path: '/settings', labelKey: 'settings', iconName: 'settings', roles: ['ADMIN', 'DEALER', 'GUEST'] }}
            t={t} 
            closeSidebar={closeSidebar}
        />
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
