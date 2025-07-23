import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Contact } from '../../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contactData: Omit<Contact, 'id'> | Partial<Omit<Contact, 'id'>>) => void;
  t: (key: string) => string;
  contactToEdit?: Contact | null;
}

const PREDEFINED_ROLES = ['Sales', 'Technical', 'Marketing'];

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, t, contactToEdit }) => {
  const [name, setName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [otherRole, setOtherRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const isEditMode = !!contactToEdit;

  useEffect(() => {
    if (isOpen) {
        if (isEditMode) {
            setName(contactToEdit.name);
            setSelectedRoles(contactToEdit.role.filter(r => PREDEFINED_ROLES.includes(r)));
            setOtherRole(contactToEdit.role.filter(r => !PREDEFINED_ROLES.includes(r)).join(', '));
            setEmail(contactToEdit.email);
            setPhone(contactToEdit.phone || '');
        } else {
            // Reset form for adding
            setName('');
            setSelectedRoles([]);
            setOtherRole('');
            setEmail('');
            setPhone('');
        }
    }
  }, [isOpen, contactToEdit, isEditMode]);

  const handleRoleChange = (role: string) => {
    setSelectedRoles(prev => 
        prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return; // Basic validation
    
    const otherRolesArray = otherRole.split(',').map(r => r.trim()).filter(Boolean);
    const finalRoles = [...selectedRoles, ...otherRolesArray];

    onSave({ name, role: finalRoles, email, phone });
    onClose();
  };
  
  const commonInputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('editContact') : t('addContact')}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('contactName')}
            </label>
            <input
              type="text"
              id="contactName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={commonInputStyles}
            />
          </div>
          
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('role')}
            </label>
            <fieldset className="space-y-2">
                {PREDEFINED_ROLES.map(role => (
                    <div key={role} className="flex items-center">
                        <input
                            id={`role-${role}`}
                            type="checkbox"
                            name="predefined-roles"
                            value={role}
                            checked={selectedRoles.includes(role)}
                            onChange={() => handleRoleChange(role)}
                            className="h-4 w-4 rounded border-gray-300 text-dji-blue focus:ring-dji-blue"
                        />
                        <label htmlFor={`role-${role}`} className="ml-3 block text-sm font-medium text-gray-900 dark:text-gray-300">
                            {t(`role${role}` as any)}
                        </label>
                    </div>
                ))}
            </fieldset>
             <div className="mt-4">
                <label htmlFor="contactRoleOther" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('roleOther')}
                </label>
                <input
                  type="text"
                  id="contactRoleOther"
                  value={otherRole}
                  placeholder={t('roleOtherPlaceholder')}
                  onChange={(e) => setOtherRole(e.target.value)}
                  className={commonInputStyles}
                />
            </div>
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('email')}
            </label>
            <input
              type="email"
              id="contactEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={commonInputStyles}
            />
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('phone')}
            </label>
            <input
              type="tel"
              id="contactPhone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={commonInputStyles}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-dji-blue hover:bg-dji-blue-dark border border-transparent rounded-md shadow-sm"
          >
            {t('save')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ContactModal;