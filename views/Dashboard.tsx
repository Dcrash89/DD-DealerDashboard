import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { UserRole, Dealer, FormSubmission, Goal, FormTemplate, DashboardWidget, Layout, WidgetType, WidgetConfig } from '../types';
import { Icon } from '../components/ui/Icon';
import WidgetRenderer from '../components/dashboard/WidgetRenderer';
import WidgetConfigModal from '../components/dashboard/WidgetConfigModal';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardProps {
  userRole: UserRole;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  dealers: Dealer[];
  formSubmissions: FormSubmission[];
  currentDealer: Dealer | null;
  goals: Goal[];
  formTemplates: FormTemplate[];
  widgets: DashboardWidget[];
  layout: Layout[];
  onLayoutChange: (layout: Layout[]) => void;
  onAddWidget: (widget: DashboardWidget, layout: Layout) => void;
  onUpdateWidget: (widgetId: string, config: WidgetConfig) => void;
  onRemoveWidget: (widgetId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userRole, t, dealers, formSubmissions, currentDealer, goals, formTemplates,
  widgets, layout, onLayoutChange, onAddWidget, onUpdateWidget, onRemoveWidget
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [widgetToEdit, setWidgetToEdit] = useState<DashboardWidget | null>(null);

  const handleAddNewWidget = () => {
    setWidgetToEdit(null);
    setIsConfigModalOpen(true);
  }

  const handleEditWidget = (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget) {
      setWidgetToEdit(widget);
      setIsConfigModalOpen(true);
    }
  };

  const handleSaveWidget = (config: WidgetConfig, type: WidgetType) => {
    if (widgetToEdit) {
      // Update existing widget
      onUpdateWidget(widgetToEdit.id, config);
    } else {
      // Add new widget
      const newWidgetId = `w-${Date.now()}`;
      const newWidget: DashboardWidget = { id: newWidgetId, type, config };
      const newLayoutItem: Layout = {
        i: newWidgetId,
        x: (layout.length * 4) % 12, // Cascade new widgets
        y: Infinity, // Puts it at the bottom
        w: 4, h: 4,
      };
      onAddWidget(newWidget, newLayoutItem);
    }
    setIsConfigModalOpen(false);
    setWidgetToEdit(null);
  };
  
  const dealerSubmissions = userRole === UserRole.DEALER && currentDealer
    ? formSubmissions.filter(s => s.dealerId === currentDealer.id)
    : formSubmissions;

  return (
    <div>
      <div className="flex justify-end items-center mb-4 gap-4">
        {isEditMode && (
          <button
            onClick={handleAddNewWidget}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center gap-2"
          >
            <Icon name="plus" className="w-5 h-5" />
            {t('addWidget')}
          </button>
        )}
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="bg-dji-blue hover:bg-dji-blue-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 flex items-center gap-2"
        >
          <Icon name={isEditMode ? 'check' : 'edit'} className="w-5 h-5" />
          {isEditMode ? t('doneEditing') : t('editDashboard')}
        </button>
      </div>

      <ResponsiveGridLayout
        className={`layout ${isEditMode ? 'border-2 border-dashed border-dji-blue/50 rounded-xl' : ''}`}
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={(newLayout) => onLayoutChange(newLayout)}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        draggableHandle=".drag-handle"
      >
        {widgets.map(widget => (
          <div key={widget.id}>
             <WidgetRenderer
                widget={widget}
                isEditMode={isEditMode}
                onEdit={handleEditWidget}
                onRemove={onRemoveWidget}
                dealers={dealers}
                submissions={dealerSubmissions}
                currentDealer={currentDealer}
                goals={goals}
                t={t}
                userRole={userRole}
             />
          </div>
        ))}
      </ResponsiveGridLayout>
      
      <WidgetConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveWidget}
        t={t}
        formTemplates={formTemplates}
        widgetToEdit={widgetToEdit}
      />

    </div>
  );
};

export default Dashboard;