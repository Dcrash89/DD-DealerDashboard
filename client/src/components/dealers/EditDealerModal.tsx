import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Dealer, DealerCategory } from '../../types';

interface EditDealerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<Omit<Dealer, 'id'>>) => void;
  t: (key: string) => string;
  dealer: Dealer | null;
}

const EditDealerModal: React.FC<EditDealerModalProps> = ({ isOpen, onClose, onSave, t, dealer }) => {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState<DealerCategory>(DealerCategory.B);
  
  useEffect(() => {
    if (dealer) {
      setName(dealer.name);
      setWebsite(dealer.website);
      setCategory(dealer.category);
    }
  }, [dealer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !website) return; // Basic validation
    onSave({ name, website, category });
    onClose();
  };

  if (!dealer) return null;
  
  const commonInputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400";
  const commonSelectStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('editDealer')}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="editDealerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('dealerName')}
            </label>
            <input
              type="text"
              id="editDealerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={commonInputStyles}
            />
          </div>
          <div>
            <label htmlFor="editWebsite" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('website')}
            </label>
            <input
              type="url"
              id="editWebsite"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              required
              className={commonInputStyles}
            />
          </div>
          <div>
            <label htmlFor="editCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('category')}
            </label>
            <select
              id="editCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value as DealerCategory)}
              className={commonSelectStyles}
            >
              <option value={DealerCategory.S}>Category S</option>
              <option value={DealerCategory.A}>Category A</option>
              <option value={DealerCategory.B}>Category B</option>
            </select>
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

export default EditDealerModal;