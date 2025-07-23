import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Goal, DealerCategory } from '../../types';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<Omit<Goal, 'id'>>) => void;
  t: (key: string) => string;
  goal: Goal | null;
}

const activityTypes: Goal['activityType'][] = ['Evento Fisico', 'Campagna Online', 'PR', 'Fiera'];
const dealerCategories = Object.values(DealerCategory);

const EditGoalModal: React.FC<EditGoalModalProps> = ({ isOpen, onClose, onSave, t, goal }) => {
  const [category, setCategory] = useState<DealerCategory>(DealerCategory.B);
  const [activityType, setActivityType] = useState<Goal['activityType']>(activityTypes[0]);
  const [count, setCount] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  useEffect(() => {
    if (goal) {
        setCategory(goal.category);
        setActivityType(goal.activityType);
        setCount(goal.count);
        setStartDate(goal.startDate);
        setEndDate(goal.endDate);
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (count < 1 || !startDate || !endDate) return;
    onSave({ category, activityType, count, startDate, endDate });
    onClose();
  };
  
  if (!goal) return null;
  
  const commonInputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400";
  const commonSelectStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('editGoal')}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          
          <div>
            <label htmlFor="editGoalCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('category')}
            </label>
            <select
              id="editGoalCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value as DealerCategory)}
              className={commonSelectStyles}
            >
              {dealerCategories.map(cat => <option key={cat} value={cat}>{t('category')} {cat}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="editGoalActivityType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('activityType')}
            </label>
            <select
              id="editGoalActivityType"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value as Goal['activityType'])}
              className={commonSelectStyles}
            >
              {activityTypes.map(opt => <option key={opt} value={opt}>{t(opt)}</option>)}
            </select>
          </div>
          
          <div>
            <label htmlFor="editGoalCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('requiredCount')}
            </label>
            <input
              type="number"
              id="editGoalCount"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
              min="1"
              required
              className={commonInputStyles}
            />
          </div>

           <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="editStartDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('startDate')}
              </label>
              <input
                type="date"
                id="editStartDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className={commonInputStyles}
              />
            </div>
            <div>
              <label htmlFor="editEndDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('endDate')}
              </label>
              <input
                type="date"
                id="editEndDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className={commonInputStyles}
              />
            </div>
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

export default EditGoalModal;