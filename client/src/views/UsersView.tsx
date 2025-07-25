import React, { useState } from 'react';
import { User } from '../types';
import { Icon } from '../components/ui/Icon';
import { useData } from '../hooks/useData';
import UserModal from '../components/users/UserModal';
import ResetPasswordModal from '../components/users/ResetPasswordModal';

interface UsersViewProps {
  t: (key: string) => string;
}

const UsersView: React.FC<UsersViewProps> = ({ t }) => {
  const { users, dealers, createUser, updateUser, deleteUser, resetUserPassword } = useData();
  
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm(t('confirmDeleteUserMessage'))) {
      deleteUser(userId);
    }
  };
  
  const handleResetPassword = async (userId: string) => {
    const success = await resetUserPassword(userId);
    if (success) {
      setIsResetModalOpen(true);
    }
  };

  const getDealerName = (dealerId?: string | null) => {
    if (!dealerId) return '-';
    return dealers.find(d => d.id === dealerId)?.name || 'Unknown';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('userManagement')}</h2>
        <button
          onClick={handleOpenAddUser}
          className="flex items-center bg-dji-blue hover:bg-dji-blue-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          <Icon name="user-plus" className="w-5 h-5 mr-2" />
          {t('addUser')}
        </button>
      </div>

       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('email')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('role')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('assignedDealer')}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">{t(user.role)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{getDealerName(user.dealerId)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleResetPassword(user.id)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title={t('resetPassword')}>
                      <Icon name="key" className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleOpenEditUser(user)} className="text-dji-blue hover:text-dji-blue-dark ml-2 p-2 rounded-full hover:bg-dji-blue/10" title={t('editUser')}>
                      <Icon name="edit" className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 ml-2 p-2 rounded-full hover:bg-red-500/10" title={t('deleteUser')}>
                      <Icon name="trash" className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <UserModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={editingUser ? updateUser : createUser}
        t={t}
        userToEdit={editingUser}
        dealers={dealers}
      />
      
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        t={t}
      />
    </>
  );
};

export default UsersView;
