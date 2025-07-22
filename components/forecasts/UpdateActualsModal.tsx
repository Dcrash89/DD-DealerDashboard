import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { SalesForecast } from '../../types';

interface UpdateActualsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, actualUnits: number) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  forecastToEdit: SalesForecast | null;
}

const UpdateActualsModal: React.FC<UpdateActualsModalProps> = ({ isOpen, onClose, onSave, t, forecastToEdit }) => {
  const [actualUnits, setActualUnits] = useState(0);

  useEffect(() => {
    if (isOpen && forecastToEdit) {
      setActualUnits(forecastToEdit.actualUnits);
    }
  }, [isOpen, forecastToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forecastToEdit || actualUnits < 0) return;
    onSave(forecastToEdit.id, actualUnits);
    onClose();
  };

  if (!forecastToEdit) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('updateActuals')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg'>
          <p><strong>{t('product')}:</strong> {forecastToEdit.productName}</p>
          <p><strong>{t('period')}:</strong> {t('Q{q}', {q: forecastToEdit.quarter})} {forecastToEdit.year}</p>
          <p><strong>{t('forecastedUnits')}:</strong> {forecastToEdit.forecastedUnits}</p>
        </div>
        <div>
          <label htmlFor="actualUnits" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('actualUnits')}</label>
          <input
            id="actualUnits"
            type="number"
            value={actualUnits}
            min="0"
            onChange={e => setActualUnits(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600"
            autoFocus
          />
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">{t('cancel')}</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-dji-blue hover:bg-dji-blue-dark border border-transparent rounded-md shadow-sm">{t('save')}</button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateActualsModal;