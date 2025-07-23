
import React, { useMemo } from 'react';
import { Dealer, FormSubmission, Goal, FormStatus } from '../../types';
import { getDaysRemaining } from '../../utils/dateUtils';
import { Icon } from '../ui/Icon';

interface GoalsProgressProps {
  dealer: Dealer | null;
  submissions: FormSubmission[];
  goals: Goal[];
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const GoalsProgress: React.FC<GoalsProgressProps> = ({ dealer, submissions, goals, t }) => {
  
  const dealerGoalProgress = useMemo(() => {
    if (!dealer) return [];
    
    const applicableGoals = goals.filter(g => g.category === dealer.category);
    
    return applicableGoals.map(goal => {
      const startDate = new Date(goal.startDate);
      const endDate = new Date(goal.endDate);

      const completedSubmissionsCount = submissions.filter(s => {
        if (s.dealerId !== dealer.id) return false;
        const activityDate = s.eventDate ? new Date(s.eventDate) : new Date(s.submissionDate);
        return s.status === FormStatus.COMPLETED &&
               s.goalValue === goal.activityType &&
               activityDate >= startDate &&
               activityDate <= endDate;
      }).length;

      const daysRemaining = getDaysRemaining(goal.endDate);

      return {
        ...goal,
        currentCount: completedSubmissionsCount,
        isCompleted: completedSubmissionsCount >= goal.count,
        progress: Math.min((completedSubmissionsCount / goal.count) * 100, 100),
        daysRemaining: daysRemaining
      };
    });
  }, [dealer, submissions, goals]);

  if (!dealer || dealerGoalProgress.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-4">
        <Icon name="goals" className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
        <p>{t('noGoalsFound')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2 h-full overflow-y-auto">
      {dealerGoalProgress.map(goal => (
        <div key={goal.id}>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t(goal.activityType)}
            </p>
            <p className={`text-sm font-bold ${goal.isCompleted ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'}`}>
              {goal.currentCount}/{goal.count}
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-1">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${goal.isCompleted ? 'bg-green-500' : 'bg-dji-blue'}`}
              style={{ width: `${goal.progress}%` }}
            ></div>
          </div>
            <p className="text-xs text-right text-gray-500 dark:text-gray-400">
                {goal.daysRemaining > 0 ? t('daysRemaining', { count: goal.daysRemaining }) : t('Completed')}
            </p>
        </div>
      ))}
    </div>
  );
};

export default GoalsProgress;
