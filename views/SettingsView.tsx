
import React from 'react';
import { UserRole, Dealer, AppView } from '../types';
import { Icon } from '../components/ui/Icon';
import { Dropdown } from '../components/ui/Dropdown';
import SegmentedControl from '../components/ui/SegmentedControl';

interface SettingsViewProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  lang: string;
  setLang: (lang: 'it' | 'en' | 'zh') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userRole: UserRole;
  currentDealer: Dealer | null;
  setActiveView: (view: AppView) => void;
}

const SettingsCard: React.FC<{title: string, children: React.ReactNode, className?: string}> = ({ title, children, className }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);


const SettingsView: React.FC<SettingsViewProps> = ({
    t, lang, setLang, theme, toggleTheme, userRole, currentDealer, setActiveView
}) => {

    const langOptions = [
        { value: 'it', label: 'Italiano' },
        { value: 'en', label: 'English' },
        { value: 'zh', label: '中文' },
    ];
    
    const themeOptions: { value: 'light' | 'dark'; label: string; icon: React.ReactNode }[] = [
        { value: 'light', label: t('lightTheme'), icon: <Icon name="sun" className="w-5 h-5"/> },
        { value: 'dark', label: t('darkTheme'), icon: <Icon name="moon" className="w-5 h-5"/> },
    ];

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        if (newTheme !== theme) {
            toggleTheme();
        }
    };

    const userDisplayName = userRole === UserRole.ADMIN ? 'Admin' : (currentDealer?.name || 'Dealer');

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">{t('settingsAndProfile')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <SettingsCard title={t('userProfile')}>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-dji-blue flex items-center justify-center text-white font-bold text-4xl mb-4">
                                {userDisplayName.charAt(0)}
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 dark:text-white">{userDisplayName}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('role')}: {t(userRole)}</p>
                        </div>
                    </SettingsCard>
                    <SettingsCard title={t('about')}>
                         <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{t('appName')}</span>
                                <span className="font-semibold">{t('appNameFull')}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{t('version')}</span>
                                <span className="font-semibold">1.0.0</span>
                            </div>
                        </div>
                    </SettingsCard>
                </div>
                
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <SettingsCard title={t('appPreferences')}>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('selectLanguage')}</label>
                            <Dropdown 
                                options={langOptions}
                                selectedValue={lang}
                                onSelect={(value) => setLang(value as 'it' | 'en' | 'zh')}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('theme')}</label>
                            <SegmentedControl 
                                name="theme-selector"
                                options={themeOptions}
                                value={theme}
                                onChange={handleThemeChange}
                            />
                        </div>
                    </SettingsCard>
                    
                    {userRole === UserRole.DEALER && (
                        <SettingsCard title={t('teamManagement')}>
                            <button onClick={() => setActiveView('myTeam')} className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Icon name="myTeam" className="w-5 h-5 text-dji-blue"/>
                                    <span className="font-semibold">{t('myTeam')}</span>
                                </div>
                                <Icon name="chevron-right" className="w-5 h-5 text-gray-400"/>
                            </button>
                        </SettingsCard>
                    )}

                    <SettingsCard title={t('passwordAndSecurity')}>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-900/40">
                            <div className="flex items-center gap-3">
                                <Icon name="key" className="w-5 h-5 text-gray-400 dark:text-gray-500"/>
                                <span className="font-semibold text-gray-500 dark:text-gray-400">{t('changePassword')}</span>
                            </div>
                            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{t('comingSoon')}</span>
                        </div>
                    </SettingsCard>
                </div>

            </div>
        </div>
    );
};

export default SettingsView;
