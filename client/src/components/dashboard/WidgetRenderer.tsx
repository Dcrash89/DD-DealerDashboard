import React from 'react';
import { DashboardWidget, WidgetType, Dealer, FormSubmission, Goal } from '../../types';
import WidgetWrapper from './WidgetWrapper';
import StatCardWidget from './widgets/StatCardWidget';
import ChartWidget from './widgets/ChartWidget';
import GoalsWidget from './widgets/GoalsWidget';
import RecentSubmissionsWidget from './widgets/RecentSubmissionsWidget';
import { useAuth } from '../../hooks/useAuth';

interface WidgetRendererProps {
  widget: DashboardWidget;
  isEditMode: boolean;
  onEdit: (widgetId: string) => void;
  onRemove: (widgetId: string) => void;
  // Data props passed down
  dealers: Dealer[];
  submissions: FormSubmission[];
  currentDealer: Dealer | null;
  goals: Goal[];
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  isEditMode,
  onEdit,
  onRemove,
  dealers,
  submissions,
  currentDealer,
  goals,
  t,
}) => {
  const { user } = useAuth();
  const renderWidgetContent = () => {
    switch (widget.type) {
      case WidgetType.STAT_CARD:
        return <StatCardWidget config={widget.config} submissions={submissions} dealers={dealers} t={t} />;
      case WidgetType.CHART:
        return <ChartWidget config={widget.config} submissions={submissions} t={t} />;
      case WidgetType.GOALS:
        return <GoalsWidget config={widget.config} currentDealer={currentDealer} submissions={submissions} goals={goals} t={t} />;
      case WidgetType.RECENT_SUBMISSIONS:
        return <RecentSubmissionsWidget config={widget.config} submissions={submissions} userRole={user!.role} t={t} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <WidgetWrapper
      title={t(widget.config.title) || widget.config.title}
      isEditMode={isEditMode}
      onEdit={() => onEdit(widget.id)}
      onRemove={() => onRemove(widget.id)}
    >
      {renderWidgetContent()}
    </WidgetWrapper>
  );
};

export default WidgetRenderer;
