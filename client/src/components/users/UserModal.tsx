import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { User, UserRole, Dealer } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (...args: any) => void;
  t: (key: string) => string;
  userToEdit: User | null;
  dealers: Dealer[];
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, t, userToEdit, dealers }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('DEALER');
  const [dealerId, setDealerId] = useState<string | null>(null);

  const isEditMode = !!userToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && userToEdit) {
        setEmail(userToEdit.email);
        setRole(userToEdit.role);
        setDealerId(userToEdit.dealerId || null);
        setPassword(''); // Password is not edited here
      } else {
        setEmail('');
        setPassword('');
        setRole('DEALER');
        setDealerId(dealers.length > 0 ? dealers[0].id : null);
      }
    }
  }, [isOpen, userToEdit, isEditMode, dealers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (!isEditMode && !password)) return;

    const data: any = { email, role, dealerId: role === 'DEALER' ? dealerId : null };
    if (isEditMode && userToEdit) {
        onSave(userToEdit.id, data);
    } else {
        data.password = password;
        onSave(data);
    }
    onClose();
  };

  const commonInputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600";
  const commonSelectStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('editUser') : t('addUser')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('email')}</label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className={commonInputStyles} />
        </div>
        {!isEditMode && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className={commonInputStyles} />
            <p className="text-xs text-gray-500 mt-1">{t('passwordInitialCreationNote')}</p>
          </div>
        )}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('role')}</label>
          <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className={commonSelectStyles}>
            <option value="ADMIN">{t('ADMIN')}</option>
            <option value="DEALER">{t('DEALER')}</option>
            <option value="GUEST">{t('GUEST')}</option>
          </select>
        </div>
        {role === 'DEALER' && (
          <div>
            <label htmlFor="dealerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('assignedDealer')}</label>
            <select id="dealerId" value={dealerId || ''} onChange={e => setDealerId(e.target.value)} className={commonSelectStyles} required>
                <option value="">{t('selectDealer')}</option>
                {dealers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border dark:bg-gray-600 dark:border-gray-500">{t('cancel')}</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-dji-blue rounded-md">{t('save')}</button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
