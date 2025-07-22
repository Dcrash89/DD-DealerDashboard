
import React, { useState } from 'react';
import { Dealer, Contact } from '../types';
import { Icon } from '../components/ui/Icon';
import ContactModal from '../components/contacts/ContactModal';

interface MyTeamViewProps {
  t: (key: string) => string;
  currentDealer: Dealer;
  onAddContact: (contactData: Omit<Contact, 'id'>) => void;
  onUpdateContact: (contactId: string, updatedData: Partial<Omit<Contact, 'id'>>) => void;
  onDeleteContact: (contactId: string) => void;
}

const MyTeamView: React.FC<MyTeamViewProps> = ({ t, currentDealer, onAddContact, onUpdateContact, onDeleteContact }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleOpenAddModal = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleSaveContact = (contactData: Omit<Contact, 'id'> | Partial<Omit<Contact, 'id'>>) => {
    if (editingContact) {
      onUpdateContact(editingContact.id, contactData);
    } else {
      onAddContact(contactData as Omit<Contact, 'id'>);
    }
    handleCloseModal();
  };
  
  const handleDeleteContact = (contactId: string) => {
    if (window.confirm(t('confirmDeleteContactMessage'))) {
      onDeleteContact(contactId);
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('myTeam')}</h2>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center bg-dji-blue hover:bg-dji-blue-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          <Icon name="user-plus" className="w-5 h-5 mr-2" />
          {t('addContact')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('contactName')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('role')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('email')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('phone')}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentDealer.contacts.length > 0 ? currentDealer.contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{contact.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-wrap gap-1">
                        {contact.role.map((r) => (
                        <span key={r} className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                            {r}
                        </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{contact.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{contact.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleOpenEditModal(contact)} className="text-dji-blue hover:text-dji-blue-dark p-2 rounded-full hover:bg-dji-blue/10 transition-colors" title={t('editContact')}>
                      <Icon name="edit" className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteContact(contact.id)} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors ml-2" title={t('deleteContact')}>
                      <Icon name="trash" className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">{t('noContacts')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
        {t('roleAssignmentNote')}
      </p>
      <ContactModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveContact}
        t={t}
        contactToEdit={editingContact}
      />
    </>
  );
};

export default MyTeamView;