
import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { FormField, FormFieldType, GoalActivityType, Form, FieldCondition } from '../../types';
import { Icon } from '../ui/Icon';

interface FormFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: FormField) => void;
  t: (key: string) => string;
  fieldToEdit?: FormField | null;
  template: Form | null;
}

const fieldTypes = Object.values(FormFieldType);
const goalCategories: GoalActivityType[] = ['Evento Fisico', 'Campagna Online', 'PR', 'Fiera'];

const FormFieldModal: React.FC<FormFieldModalProps> = ({ isOpen, onClose, onSave, t, fieldToEdit, template }) => {
  const [field, setField] = useState<Partial<FormField>>({});
  const [optionsText, setOptionsText] = useState('');

  const isEditMode = !!fieldToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setField(fieldToEdit);
        if (fieldToEdit.options) {
            setOptionsText(fieldToEdit.options.map(opt => `${opt.value}:${opt.label}:${opt.goalCategory || ''}`).join('\n'));
        } else {
            setOptionsText('');
        }
      } else {
        setField({
          id: `field-${Date.now()}`,
          type: FormFieldType.TEXT,
          required: false,
          isGoalLink: false,
          isEventDate: false,
          options: [],
          conditions: []
        });
        setOptionsText('');
      }
    }
  }, [isOpen, fieldToEdit, isEditMode]);
  
  const handleChange = (key: keyof FormField, value: any) => {
    const newFieldData = {...field, [key]: value };
    if(key === 'type') {
      newFieldData.isGoalLink = false;
      newFieldData.isEventDate = false;
    }
    setField(newFieldData);
  }

  const handleOptionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOptionsText(e.target.value);
    const lines = e.target.value.split('\n');
    const newOptions = lines.map(line => {
        const [value, label, goalCategory] = line.split(':');
        return {
            value: value?.trim() || '',
            label: label?.trim() || value?.trim() || '',
            goalCategory: goalCategories.includes(goalCategory?.trim() as any) ? goalCategory.trim() as GoalActivityType : undefined,
        };
    }).filter(opt => opt.value);
    handleChange('options', newOptions);
  }
  
  const handleConditionChange = (index: number, key: keyof FieldCondition, value: any) => {
    const newConditions = [...(field.conditions || [])];
    newConditions[index] = { ...newConditions[index], [key]: value };
    handleChange('conditions', newConditions);
  };
  
  const addCondition = () => {
    const newConditions = [...(field.conditions || []), { fieldId: '', value: ''}];
    handleChange('conditions', newConditions);
  }

  const removeCondition = (index: number) => {
    const newConditions = (field.conditions || []).filter((_, i) => i !== index);
    handleChange('conditions', newConditions);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!field.label) {
        alert('Label is required');
        return;
    }
    onSave(field as FormField);
    onClose();
  };

  const conditionalFields = template?.fields.filter(f => f.id !== field.id && f.type === FormFieldType.SELECT);
  const commonInputStyles = "w-full mt-1 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 focus:ring-dji-blue focus:border-dji-blue placeholder-gray-500 dark:placeholder-gray-400";
  const commonSelectStyles = "w-full mt-1 p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 focus:ring-dji-blue focus:border-dji-blue";
  const conditionalSelectStyles = "flex-1 p-1 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:ring-dji-blue focus:border-dji-blue";


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('editField') : t('addFormField')}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <label className="block text-sm font-medium">{t('fieldLabel')}</label>
          <input
            type="text"
            value={field.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            required
            className={commonInputStyles}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">{t('fieldType')}</label>
          <select
            value={field.type}
            onChange={(e) => handleChange('type', e.target.value as FormFieldType)}
            className={commonSelectStyles}
          >
            {fieldTypes.map(type => <option key={type} value={type}>{t(type)}</option>)}
          </select>
        </div>
        
        <div className="flex items-center">
            <input
                id="requiredField"
                type="checkbox"
                checked={field.required || false}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-dji-blue focus:ring-dji-blue"
            />
            <label htmlFor="requiredField" className="ml-2 block text-sm">
                {t('requiredField')}
            </label>
        </div>

        {field.type === FormFieldType.SELECT && (
          <div className="p-3 border rounded-md dark:border-gray-600 space-y-3">
            <div>
              <label className="block text-sm font-medium">{t('optionsOnePerLine')}</label>
              <p className="text-xs text-gray-500 mb-1">Formato: `valore:etichetta` o `valore:etichetta:CategoriaObiettivo`</p>
              <textarea
                value={optionsText}
                onChange={handleOptionsChange}
                rows={5}
                className={`${commonInputStyles} font-mono text-sm`}
                placeholder={'es: webinar:Webinar:Campagna Online\ndemo:Demo Prodotto:Evento Fisico'}
              />
            </div>
            <div className="flex items-center">
                <input
                    id="isGoalLink"
                    type="checkbox"
                    checked={field.isGoalLink || false}
                    onChange={(e) => handleChange('isGoalLink', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-dji-blue focus:ring-dji-blue"
                />
                <label htmlFor="isGoalLink" className="ml-2 block text-sm">
                    {t('linkToGoal')}
                </label>
            </div>
          </div>
        )}

        {field.type === FormFieldType.DATE && (
           <div className="flex items-center">
                <input
                    id="isEventDate"
                    type="checkbox"
                    checked={field.isEventDate || false}
                    onChange={(e) => handleChange('isEventDate', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-dji-blue focus:ring-dji-blue"
                />
                <label htmlFor="isEventDate" className="ml-2 block text-sm">
                    {t('useAsCalendarEventDate')}
                </label>
            </div>
        )}

        {conditionalFields && conditionalFields.length > 0 && (
            <div className="p-3 border rounded-md dark:border-gray-600 space-y-3">
                <h4 className="font-semibold text-sm">{t('conditionalLogic')}</h4>
                <p className="text-xs text-gray-500">{t('thenShowThisField')}</p>
                {field.conditions?.map((cond, index) => {
                   const conditionField = template?.fields.find(f => f.id === cond.fieldId);
                   return (
                     <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-md">
                        <span className="text-sm">{t('ifFieldIs')}</span>
                        <select 
                           value={cond.fieldId}
                           onChange={(e) => handleConditionChange(index, 'fieldId', e.target.value)}
                           className={conditionalSelectStyles}
                        >
                            <option value="">{t('selectField')}</option>
                            {conditionalFields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                        </select>
                        <span className="text-sm">{t('isValue')}</span>
                        <select 
                           value={cond.value}
                           onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                           className={conditionalSelectStyles}
                        >
                            <option value="">{t('selectValue')}</option>
                            {conditionField?.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <button type="button" onClick={() => removeCondition(index)} className="p-1 text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><Icon name="trash" className="w-4 h-4" /></button>
                     </div>
                   )
                })}
                <button type="button" onClick={addCondition} className="text-sm text-dji-blue font-semibold flex items-center gap-1">
                    <Icon name="plus" className="w-4 h-4"/>
                    {t('addCondition')}
                </button>
            </div>
        )}

        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">{t('cancel')}</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-dji-blue hover:bg-dji-blue-dark border border-transparent rounded-md shadow-sm">{t('save')}</button>
        </div>
      </form>
    </Modal>
  );
};

export default FormFieldModal;
