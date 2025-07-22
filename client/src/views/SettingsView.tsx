import React, { useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { Dropdown } from '../components/ui/Dropdown';
import SegmentedControl from '../components/ui/SegmentedControl';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { useNavigate } from 'react-router-dom';

interface SettingsViewProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  lang: string;
  setLang: (lang: 'it' | 'en' | 'zh') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const SettingsCard: React.FC<{title: string, children: React.ReactNode, className?: string}> = ({ title, children, className }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 ${className}`}>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const PasswordField: React.FC<{id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ id, label, value, onChange }) => {
    const [isShown, setIsShown] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    type={isShown ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button type="button" onClick={() => setIsShown(!isShown)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500">
                    <Icon name={isShown ? 'eye' : 'eye-off'} className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
}


const SettingsView: React.FC<SettingsViewProps> = ({
    t, lang, setLang, theme, toggleTheme
}) => {
    const { user, logout } = useAuth();
    const { currentDealer, changePassword } = useData();
    const navigate = useNavigate();
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });


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
    
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: t('passwordsDoNotMatch') });
            return;
        }
        if (newPassword.length < 8) {
             setPasswordMessage({ type: 'error', text: t('passwordTooShort') });
            return;
        }

        const success = await changePassword(currentPassword, newPassword);
        if (success) {
            setPasswordMessage({ type: 'success', text: t('passwordChangedSuccess') });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setPasswordMessage({ type: 'error', text: t('currentPasswordIncorrect') });
        }
    }


    const userDisplayName = user?.role === 'ADMIN' ? 'Admin' : (currentDealer?.name || 'Dealer');

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">{t('settingsAndProfile')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <SettingsCard title={t('userProfile')}>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-dji-blue flex items-center justify-center text-white font-bold text-4xl mb-4">
                                {userDisplayName.charAt(0).toUpperCase()}
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 dark:text-white">{userDisplayName}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('role')}: {t(user?.role || '')}</p>
                             <button onClick={logout} className="mt-6 w-full text-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
                                {t('logout')}
                            </button>
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
                    
                    {user?.role === 'DEALER' && (
                        <SettingsCard title={t('passwordAndSecurity')}>
                           <form onSubmit={handlePasswordChange} className="space-y-4">
                                <PasswordField id="currentPassword" label={t('currentPassword')} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                                <PasswordField id="newPassword" label={t('newPassword')} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                <PasswordField id="confirmPassword" label={t('confirmPassword')} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

                                {passwordMessage.text && (
                                    <div className={`text-sm p-3 rounded-md ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {passwordMessage.text}
                                    </div>
                                )}
                                
                                <div className="flex justify-end">
                                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-dji-blue hover:bg-dji-blue-dark border border-transparent rounded-md shadow-sm">
                                        {t('changePassword')}
                                    </button>
                                </div>
                           </form>
                        </SettingsCard>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SettingsView;
