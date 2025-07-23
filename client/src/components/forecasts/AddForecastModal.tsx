import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { SalesForecast, Dealer, Product } from '../../types';

interface AddForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SalesForecast, 'id' | 'dealerName' | 'productName' | 'actualUnits' | 'status'>) => void;
  onUpdate: (id: string, data: Partial<Omit<SalesForecast, 'id'>>) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  forecastToEdit: SalesForecast | null;
  dealers: Dealer[];
  products: Product[];
}

const AddForecastModal: React.FC<AddForecastModalProps> = ({ isOpen, onClose, onSave, onUpdate, t, forecastToEdit, dealers, products }) => {
  const [dealerId, setDealerId] = useState('');
  const [productId, setProductId] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [quarter, setQuarter] = useState<1 | 2 | 3 | 4>(1);
  const [forecastedUnits, setForecastedUnits] = useState(0);
  
  const isEditMode = !!forecastToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setDealerId(forecastToEdit.dealerId);
        setProductId(forecastToEdit.productId);
        setYear(forecastToEdit.year);
        setQuarter(forecastToEdit.quarter);
        setForecastedUnits(forecastToEdit.forecastedUnits);
      } else {
        // Reset form
        setDealerId(dealers[0]?.id || '');
        setProductId(products[0]?.id || '');
        setYear(new Date().getFullYear());
        setQuarter(1);
        setForecastedUnits(0);
      }
    }
  }, [isOpen, forecastToEdit, isEditMode, dealers, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealerId || !productId || !year || !quarter || forecastedUnits < 0) return;
    
    if (isEditMode) {
        onUpdate(forecastToEdit.id, { dealerId, productId, year, quarter, forecastedUnits });
    } else {
        onSave({ dealerId, productId, year, quarter, forecastedUnits });
    }
    onClose();
  };
  
  const quarterOptions = [1, 2, 3, 4];
  const commonInputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400";
  const commonSelectStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600";


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('editForecast') : t('addForecast')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('dealer')}</label>
          <select value={dealerId} onChange={e => setDealerId(e.target.value)} className={commonSelectStyles}>
             {dealers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('product')}</label>
          <select value={productId} onChange={e => setProductId(e.target.value)} className={commonSelectStyles}>
             {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('year')}</label>
              <input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className={commonInputStyles} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('quarter')}</label>
              <select value={quarter} onChange={e => setQuarter(Number(e.target.value) as 1|2|3|4)} className={commonSelectStyles}>
                {quarterOptions.map(q => <option key={q} value={q}>{t('Q{q}', {q})}</option>)}
              </select>
            </div>
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('forecastedUnits')}</label>
          <input type="number" value={forecastedUnits} min="0" onChange={e => setForecastedUnits(Number(e.target.value))} className={commonInputStyles} />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">{t('cancel')}</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-dji-blue hover:bg-dji-blue-dark border border-transparent rounded-md shadow-sm">{t('save')}</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddForecastModal;