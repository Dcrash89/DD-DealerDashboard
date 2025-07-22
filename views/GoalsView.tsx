
import React, { useState } from 'react';
import { Goal, DealerCategory } from '../types';
import { Icon } from '../components/ui/Icon';
import AddGoalModal from '../components/goals/AddGoalModal';
import EditGoalModal from '../components/goals/EditGoalModal';
import CategoryBadge from '../components/dealers/CategoryBadge';

interface GoalsViewProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (goalId: string, updatedData: Partial<Omit<Goal, 'id'>>) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ t, goals, onAddGoal, onUpdateGoal, onDeleteGoal }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const handleDelete = (goalId: string) => {
    if (window.confirm(t('confirmDeleteGoalMessage'))) {
      onDeleteGoal(goalId);
    }
  };
  
  const handleUpdate = (updatedData: Partial<Omit<Goal, 'id'>>) => {
      if (!editingGoal) return;
      onUpdateGoal(editingGoal.id, updatedData);
      setEditingGoal(null);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('goalManagement')}</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center bg-dji-blue hover:bg-dji-blue-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          <Icon name="goals" className="w-5 h-5 mr-2" />
          {t('addGoal')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('category')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('activityType')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('requiredCount')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('startDate')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('endDate')}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {goals.length > 0 ? goals.map((goal) => (
                <tr key={goal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><CategoryBadge category={goal.category} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{t(goal.activityType)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-800 dark:text-gray-200">{goal.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{goal.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{goal.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setEditingGoal(goal)} className="text-dji-blue hover:text-dji-blue-dark p-2 rounded-full hover:bg-dji-blue/10 transition-colors" title={t('editGoal')}>
                      <Icon name="edit" className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(goal.id)} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors ml-2" title={t('deleteGoal')}>
                      <Icon name="trash" className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">{t('noGoalsFound')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onAddGoal}
        t={t}
      />
      
      {editingGoal && (
         <EditGoalModal
            isOpen={!!editingGoal}
            onClose={() => setEditingGoal(null)}
            onSave={handleUpdate}
            goal={editingGoal}
            t={t}
        />
      )}
    </>
  );
};

export default GoalsView;
