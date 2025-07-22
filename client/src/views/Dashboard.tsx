import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Icon } from '../components/ui/Icon';
import { WidgetType, WidgetConfig, DashboardWidget, Layout } from '../types';
import WidgetRenderer from '../components/dashboard/WidgetRenderer';
import WidgetConfigModal from '../components/dashboard/WidgetConfigModal';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const Dashboard: React.FC<DashboardProps> = ({ t }) => {
  const { user } = useAuth();
  const { 
    dealers, formSubmissions, currentDealer, goals, forms, 
    dashboardWidgets, dashboardLayout, updateDashboardLayout,
    addWidget, updateWidget, removeWidget
  } = useData();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [widgetToEdit, setWidgetToEdit] = useState<DashboardWidget | null>(null);

  const handleAddNewWidget = () => {
    setWidgetToEdit(null);
    setIsConfigModalOpen(true);
  }

  const handleEditWidget = (widgetId: string) => {
    const widget = dashboardWidgets.find(w => w.id === widgetId);
    if (widget) {
      setWidgetToEdit(widget);
      setIsConfigModalOpen(true);
    }
  };

  const handleSaveWidget = (config: WidgetConfig, type: WidgetType) => {
    if (widgetToEdit) {
      updateWidget(widgetToEdit.id, config);
    } else {
      const newWidgetId = `w-${Date.now()}`;
      const newWidget: DashboardWidget = { id: newWidgetId, type, config };
      const newLayoutItem: Layout = {
        i: newWidgetId, x: (dashboardLayout.length * 4) % 12, y: Infinity, w: 4, h: 4,
      };
      addWidget(newWidget, newLayoutItem);
    }
    setIsConfigModalOpen(false);
    setWidgetToEdit(null);
  };
  
  const dealerSubmissions = user?.role === 'DEALER' && currentDealer
    ? formSubmissions.filter(s => s.dealerId === currentDealer.id)
    : formSubmissions;

  return (
    <div>
      <div className="flex justify-end items-center mb-4 gap-4">
        {user?.role === 'ADMIN' && (
          <>
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
          </>
        )}
      </div>

      <ResponsiveGridLayout
        className={`layout ${isEditMode ? 'border-2 border-dashed border-dji-blue/50 rounded-xl' : ''}`}
        layouts={{ lg: dashboardLayout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={(newLayout) => updateDashboardLayout(newLayout)}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        draggableHandle=".drag-handle"
      >
        {dashboardWidgets.map(widget => (
          <div key={widget.id}>
             <WidgetRenderer
                widget={widget}
                isEditMode={isEditMode}
                onEdit={handleEditWidget}
                onRemove={removeWidget}
                dealers={dealers}
                submissions={dealerSubmissions}
                currentDealer={currentDealer}
                goals={goals}
                t={t}
             />
          </div>
        ))}
      </ResponsiveGridLayout>
      
      <WidgetConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveWidget}
        t={t}
        formTemplates={forms}
        widgetToEdit={widgetToEdit}
      />
    </div>
  );
};

export default Dashboard;