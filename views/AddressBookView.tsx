import React, { useState, useMemo } from 'react';
import { Dealer, Contact } from '../types';
import { Icon } from '../components/ui/Icon';
import CategoryBadge from '../components/dealers/CategoryBadge';
import ContactModal from '../components/contacts/ContactModal';

interface AddressBookViewProps {
  dealers: Dealer[];
  t: (key: string) => string;
  onAddContact: (dealerId: string, contactData: Omit<Contact, 'id'>) => void;
  onUpdateContact: (dealerId: string, contactId: string, updatedData: Partial<Omit<Contact, 'id'>>) => void;
  onDeleteContact: (dealerId: string, contactId: string) => void;
}

const AddressBookView: React.FC<AddressBookViewProps> = ({ dealers, t, onAddContact, onUpdateContact, onDeleteContact }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDealerId, setExpandedDealerId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<{ dealerId: string, contact: Contact } | null>(null);
  const [addingContactToDealerId, setAddingContactToDealerId] = useState<string | null>(null);

  const filteredDealers = useMemo(() => {
    if (!searchTerm) {
      return dealers;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return dealers.filter(dealer =>
      dealer.name.toLowerCase().includes(lowercasedFilter) ||
      dealer.contacts.some(contact =>
        contact.name.toLowerCase().includes(lowercasedFilter) ||
        contact.email.toLowerCase().includes(lowercasedFilter) ||
        contact.role.some(r => r.toLowerCase().includes(lowercasedFilter))
      )
    );
  }, [dealers, searchTerm]);

  const toggleExpand = (dealerId: string) => {
    setExpandedDealerId(expandedDealerId === dealerId ? null : dealerId);
  };

  const handleOpenAddModal = (dealerId: string) => {
    setAddingContactToDealerId(dealerId);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (dealerId: string, contact: Contact) => {
    setEditingContact({ dealerId, contact });
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
    setAddingContactToDealerId(null);
  };

  const handleSaveContact = (contactData: Omit<Contact, 'id'> | Partial<Omit<Contact, 'id'>>) => {
    if (editingContact) {
      onUpdateContact(editingContact.dealerId, editingContact.contact.id, contactData);
    } else if (addingContactToDealerId) {
      onAddContact(addingContactToDealerId, contactData as Omit<Contact, 'id'>);
    }
    handleCloseModal();
  };
  
  const handleDeleteContact = (dealerId: string, contactId: string) => {
    if (window.confirm(t('confirmDeleteContactMessage'))) {
      onDeleteContact(dealerId, contactId);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('addressBook')}</h2>
        
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-dji-blue"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon name="search" className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredDealers.map((dealer) => (
            <div key={dealer.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleExpand(dealer.id)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <CategoryBadge category={dealer.category} />
                  <span className="font-semibold text-gray-800 dark:text-white">{dealer.name}</span>
                </div>
                <Icon name="chevronDown" className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedDealerId === dealer.id ? 'rotate-180' : ''}`} />
              </button>
              
              {expandedDealerId === dealer.id && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center mt-4 mb-2">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">{t('contacts')}</h4>
                    <button onClick={() => handleOpenAddModal(dealer.id)} className="flex items-center text-sm bg-dji-blue hover:bg-dji-blue-dark text-white font-bold py-1.5 px-3 rounded-md shadow-sm transition-colors duration-300">
                      <Icon name="user-plus" className="w-4 h-4 mr-2" />
                      {t('addContact')}
                    </button>
                  </div>
                  {dealer.contacts.length > 0 ? (
                    <ul className="space-y-3">
                      {dealer.contacts.map((contact) => (
                        <li key={contact.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="mb-2 sm:mb-0">
                            <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {contact.role.map(r => (
                                    <span key={r} className="px-2 py-0.5 text-xs font-medium bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md">{r}</span>
                                ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-x-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm flex-grow">
                                {contact.email && (
                                  <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-dji-blue dark:hover:text-dji-blue">
                                    <Icon name="email" className="w-4 h-4 flex-shrink-0" />
                                    <span>{contact.email}</span>
                                  </a>
                                )}
                                {contact.phone && (
                                  <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-dji-blue dark:hover:text-dji-blue">
                                    <Icon name="phone" className="w-4 h-4 flex-shrink-0" />
                                    <span>{contact.phone}</span>
                                  </a>
                                )}
                            </div>
                            <div className="flex-shrink-0">
                                <button onClick={() => handleOpenEditModal(dealer.id, contact)} className="text-dji-blue hover:text-dji-blue-dark p-1.5 rounded-full hover:bg-dji-blue/10 transition-colors" title={t('editContact')}>
                                  <Icon name="edit" className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteContact(dealer.id, contact.id)} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 p-1.5 rounded-full hover:bg-red-500/10 transition-colors" title={t('deleteContact')}>
                                  <Icon name="trash" className="w-4 h-4" />
                                </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">{t('noContacts')}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <ContactModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveContact}
        t={t}
        contactToEdit={editingContact?.contact || null}
      />
    </>
  );
};

export default AddressBookView;