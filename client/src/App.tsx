import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { useTheme } from './hooks/useTheme';
import { useTranslation } from './hooks/useTranslation';
import MainLayout from './components/layout/MainLayout';
import Login from './views/Login';
import { Icon } from './components/ui/Icon';

const AppRoutes: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    
    if (authLoading) {
        return (
            <div className="flex h-screen w-screen justify-center items-center bg-gray-50 dark:bg-gray-900">
                <Icon name="spinner" className="w-16 h-16 text-dji-blue" />
            </div>
        );
    }
    
    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route 
                path="/*" 
                element={
                    user ? <MainApp /> : <Navigate to="/login" />
                } 
            />
        </Routes>
    );
};

const MainApp: React.FC = () => {
    const [theme, toggleTheme] = useTheme();
    const { lang, setLang, t } = useTranslation();

    return (
        <MainLayout 
            theme={theme}
            toggleTheme={toggleTheme}
            lang={lang}
            setLang={setLang}
            t={t}
        />
    )
}

export default function App(): React.ReactNode {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}
