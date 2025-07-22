import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../hooks/useData';
import { Icon } from '../ui/Icon';

// Import Views
import Dashboard from '../../views/Dashboard';
import DealersView from '../../views/DealersView';
import FormsView from '../../views/FormsView';
import AvailableFormsView from '../../views/AvailableFormsView';
import MySubmissionsView from '../../views/MySubmissionsView';
import SalesForecastView from '../../views/SalesForecastView';
import GoalsView from '../../views/GoalsView';
import MyTeamView from '../../views/MyTeamView';
import NoticesView from '../../views/NoticesView';
import CalendarView from '../../views/CalendarView';
import AddressBookView from '../../views/AddressBookView';
import SettingsView from '../../views/SettingsView';
import UsersView from '../../views/UsersView';

interface MainLayoutProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lang: 'it' | 'en' | 'zh';
  setLang: (lang: 'it' | 'en' | 'zh') => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ theme, toggleTheme, lang, setLang, t }) => {
  const { user } = useAuth();
  const { loading: dataLoading, unreadNoticesCount } = useData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  if (!user) return <Navigate to="/login" />;

  const renderContent = () => {
    if (dataLoading) {
      return (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-50 dark:bg-gray-900 z-10">
          <Icon name="spinner" className="w-16 h-16 text-dji-blue" />
        </div>
      );
    }
    
    return (
        <Routes>
            <Route path="/" element={<Dashboard t={t} />} />
            {user.role === 'ADMIN' && <Route path="/users" element={<UsersView t={t} />} />}
            {user.role === 'ADMIN' && <Route path="/dealers" element={<DealersView t={t} />} />}
            {user.role === 'ADMIN' && <Route path="/forms" element={<FormsView t={t} />} />}
            {user.role === 'ADMIN' && <Route path="/goals" element={<GoalsView t={t} />} />}
            {user.role === 'ADMIN' && <Route path="/addressBook" element={<AddressBookView t={t} />} />}
            
            {user.role === 'DEALER' && <Route path="/availableForms" element={<AvailableFormsView t={t} />} />}
            {user.role === 'DEALER' && <Route path="/mySubmissions" element={<MySubmissionsView t={t} />} />}
            {user.role === 'DEALER' && <Route path="/myTeam" element={<MyTeamView t={t} />} />}

            {(user.role === 'ADMIN' || user.role === 'DEALER') && <Route path="/salesForecasts" element={<SalesForecastView t={t} />} />}
            {(user.role === 'ADMIN' || user.role === 'DEALER') && <Route path="/notices" element={<NoticesView t={t} />} />}
            {(user.role === 'ADMIN' || user.role === 'DEALER') && <Route path="/calendar" element={<CalendarView t={t} lang={lang} />} />}
            
            <Route path="/settings" element={<SettingsView t={t} lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />} />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        t={t} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        unreadNoticesCount={unreadNoticesCount}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          lang={lang}
          setLang={setLang}
          t={t}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
