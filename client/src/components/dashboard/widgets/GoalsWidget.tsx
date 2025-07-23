import React from 'react';
import { WidgetConfig, Dealer, FormSubmission, Goal } from '../../../types';
import GoalsProgress from '../GoalsProgress';

interface GoalsWidgetProps {
  config: WidgetConfig;
  currentDealer: Dealer | null;
  submissions: FormSubmission[];
  goals: Goal[];
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const GoalsWidget: React.FC<GoalsWidgetProps> = ({ config, currentDealer, submissions, goals, t }) => {
  return (
    <GoalsProgress
        dealer={currentDealer}
        submissions={submissions}
        goals={goals}
        t={t}
    />
  );
};

export default GoalsWidget;
