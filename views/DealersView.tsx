
import React, { useState } from 'react';
import { Dealer } from '../types';
import { Icon } from '../components/ui/Icon';
import AddDealerModal from '../components/dealers/AddDealerModal';
import EditDealerModal from '../components/dealers/EditDealerModal';
import CategoryBadge from '../components/dealers/CategoryBadge';

interface DealersViewProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  dealers: Dealer[];
  onAddDealer: (dealer: Omit<Dealer, 'id' | 'contacts'>) => void;
  onUpdateDealer: (dealerId: string, updatedData: Partial<Omit<Dealer, 'id'>>) => void;
  onDeleteDealer: (dealerId: string) => void;
}

const DealersView: React.FC<DealersViewProps> = ({ t, dealers, onAddDealer, onUpdateDealer, onDeleteDealer }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDealer, setEditingDealer] = useState<Dealer | null>(null);

  const handleDelete = (dealerId: string) => {
    if (window.confirm(t('confirmDeleteMessage'))) {
      onDeleteDealer(dealerId);
    }
  };
  
  const handleUpdate = (updatedData: Partial<Omit<Dealer, 'id'>>) => {
      if (!editingDealer) return;
      onUpdateDealer(editingDealer.id, updatedData);
      setEditingDealer(null);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('dealerManagement')}</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center bg-dji-blue hover:bg-dji-blue-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          <Icon name="dealers" className="w-5 h-5 mr-2" />
          {t('addDealer')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('dealerName')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('website')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('category')}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {dealers.length > 0 ? dealers.map((dealer) => (
                <tr key={dealer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{dealer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <a href={dealer.website} target="_blank" rel="noopener noreferrer" className="text-dji-blue hover:underline">
                      {dealer.website}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><CategoryBadge category={dealer.category} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setEditingDealer(dealer)} className="text-dji-blue hover:text-dji-blue-dark p-2 rounded-full hover:bg-dji-blue/10 transition-colors" title={t('editDealer')}>
                      <Icon name="edit" className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(dealer.id)} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors ml-2" title={t('deleteDealer')}>
                      <Icon name="trash" className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500 dark:text-gray-400">{t('noDealersFound')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddDealerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onAddDealer}
        t={t}
      />
      
      {editingDealer && (
         <EditDealerModal
            isOpen={!!editingDealer}
            onClose={() => setEditingDealer(null)}
            onSave={handleUpdate}
            dealer={editingDealer}
            t={t}
        />
      )}
    </>
  );
};

export default DealersView;
