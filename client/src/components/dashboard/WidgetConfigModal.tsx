import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { WidgetType, WidgetConfig, Form, FormFieldType, ChartType, AggregationType, DashboardWidget } from '../../types';
import { Icon } from '../ui/Icon';

interface WidgetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: WidgetConfig, type: WidgetType) => void;
  t: (key: string) => string;
  formTemplates: Form[];
  widgetToEdit: DashboardWidget | null;
}

const WidgetConfigModal: React.FC<WidgetConfigModalProps> = ({ isOpen, onClose, onSave, t, formTemplates, widgetToEdit }) => {
  const [type, setType] = useState<WidgetType>(WidgetType.STAT_CARD);
  const [config, setConfig] = useState<WidgetConfig>({ title: '' });

  const isEditMode = !!widgetToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setType(widgetToEdit.type);
        setConfig(widgetToEdit.config);
      } else {
        // Reset state for new widget
        setType(WidgetType.STAT_CARD);
        setConfig({ title: '' });
      }
    }
  }, [isOpen, widgetToEdit, isEditMode]);

  const handleConfigChange = (key: keyof WidgetConfig, value: any) => {
    setConfig(prev => {
        const newConfig = {...prev, [key]: value};
        // Reset dependent fields if the source changes
        if (key === 'formId') {
            newConfig.groupByFieldId = undefined;
            newConfig.sumOfFieldId = undefined;
        }
        if (key === 'aggregationType' && value === AggregationType.COUNT) {
            newConfig.sumOfFieldId = undefined;
        }
        return newConfig;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config, type);
  };
  
  const selectedTemplate = formTemplates.find(ft => ft.id === config.formId);
  const numericFields = selectedTemplate?.fields.filter(f => f.type === FormFieldType.NUMBER) || [];
  const selectableFields = selectedTemplate?.fields.filter(f => f.type === FormFieldType.SELECT) || [];
  
  const commonInputStyles = "w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400";
  const commonSelectStyles = "w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600";


  const renderConfigOptions = () => {
    switch(type) {
      case WidgetType.STAT_CARD:
        return (
          <div>
            <label className="block text-sm font-medium">{t('dataSource')}</label>
            <select
              value={config.formId || ''}
              onChange={(e) => handleConfigChange('formId', e.target.value)}
              className={commonSelectStyles}
            >
              <option value="">{t('totalDealers')}</option>
              {formTemplates.map(ft => <option key={ft.id} value={ft.id}>{`${t('totalSubmissions')} - ${ft.title}`}</option>)}
            </select>
          </div>
        );
      case WidgetType.CHART:
        return (
          <>
            <div>
              <label className="block text-sm font-medium">{t('dataSource')}</label>
              <select
                value={config.formId || ''}
                onChange={(e) => handleConfigChange('formId', e.target.value)}
                className={commonSelectStyles}
                required
              >
                <option value="">{t('selectForm')}</option>
                {formTemplates.map(ft => <option key={ft.id} value={ft.id}>{ft.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">{t('chartType')}</label>
              <select
                value={config.chartType || ''}
                onChange={(e) => handleConfigChange('chartType', e.target.value as ChartType)}
                className={commonSelectStyles}
                required
              >
                <option value={ChartType.BAR}>{t('BAR')}</option>
                <option value={ChartType.LINE}>{t('LINE')}</option>
                <option value={ChartType.PIE}>{t('PIE')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">{t('groupBy')}</label>
               <select
                value={config.groupByFieldId || ''}
                onChange={(e) => handleConfigChange('groupByFieldId', e.target.value)}
                className={commonSelectStyles}
                required
              >
                <option value="">{t('selectField')}</option>
                {selectableFields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium">{t('measure')}</label>
               <select
                value={config.aggregationType || ''}
                onChange={(e) => handleConfigChange('aggregationType', e.target.value as AggregationType)}
                className={commonSelectStyles}
                required
              >
                <option value={AggregationType.COUNT}>{t('COUNT')}</option>
                <option value={AggregationType.SUM}>{t('SUM')}</option>
              </select>
            </div>
            {config.aggregationType === AggregationType.SUM && (
                 <div>
                  <label className="block text-sm font-medium">{t('sumOf')}</label>
                   <select
                    value={config.sumOfFieldId || ''}
                    onChange={(e) => handleConfigChange('sumOfFieldId', e.target.value)}
                    className={commonSelectStyles}
                    required
                  >
                    <option value="">{t('selectFieldToSum')}</option>
                     {numericFields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                  </select>
                </div>
            )}
          </>
        )
       case WidgetType.RECENT_SUBMISSIONS:
         return (
            <>
                <div>
                  <label className="block text-sm font-medium">{t('dataSource')}</label>
                  <select
                    value={config.formId || ''}
                    onChange={(e) => handleConfigChange('formId', e.target.value)}
                    className={commonSelectStyles}
                    required
                  >
                    <option value="">{t('selectForm')}</option>
                    {formTemplates.map(ft => <option key={ft.id} value={ft.id}>{ft.title}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium">{t('limit')}</label>
                   <input
                        type="number"
                        value={config.limit || 5}
                        onChange={(e) => handleConfigChange('limit', parseInt(e.target.value))}
                        className={commonInputStyles}
                        min="1"
                        max="20"
                    />
                </div>
            </>
         )
      default:
        return null;
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('configureWidget') : t('addWidget')}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <label className="block text-sm font-medium">{t('widgetTitle')}</label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => handleConfigChange('title', e.target.value)}
            required
            className={commonInputStyles}
          />
        </div>
        {!isEditMode && (
          <div>
            <label className="block text-sm font-medium">{t('widgetType')}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as WidgetType)}
              className={commonSelectStyles}
            >
              <option value={WidgetType.STAT_CARD}>{t('STAT_CARD')}</option>
              <option value={WidgetType.CHART}>{t('CHART')}</option>
              <option value={WidgetType.GOALS}>{t('GOALS')}</option>
              <option value={WidgetType.RECENT_SUBMISSIONS}>{t('RECENT_SUBMISSIONS')}</option>
            </select>
          </div>
        )}
        
        {renderConfigOptions()}

        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">{t('cancel')}</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-dji-blue hover:bg-dji-blue-dark border border-transparent rounded-md shadow-sm">{t('save')}</button>
        </div>
      </form>
    </Modal>
  );
};

export default WidgetConfigModal;