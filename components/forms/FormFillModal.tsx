import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { FormTemplate, FormFieldType, FormSubmission, FormField } from '../../types';

interface FormFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, any>) => void;
  template: FormTemplate | null;
  t: (key: string) => string;
  submissionToEdit?: FormSubmission | null;
}

const FormFillModal: React.FC<FormFillModalProps> = ({ isOpen, onClose, onSave, template, t, submissionToEdit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const isEditMode = !!submissionToEdit;

  useEffect(() => {
    if (isOpen && template) {
      // Initialize form data
      const initialData = isEditMode 
        ? submissionToEdit.data
        : template.fields.reduce((acc, field) => {
            acc[field.id] = '';
            return acc;
          }, {} as Record<string, any>);
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [isOpen, template, submissionToEdit, isEditMode]);

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };
  
  const shouldShowField = (field: FormField) => {
    if (!field.conditions || field.conditions.length === 0) {
        return true;
    }
    // "AND" logic for multiple conditions
    return field.conditions.every(condition => {
        const valueInForm = formData[condition.fieldId];
        return valueInForm == condition.value;
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;
    
    // Basic validation
    for(const field of template.fields) {
        if (shouldShowField(field) && field.required && !formData[field.id]) {
            alert(`Field "${field.label}" is required.`);
            return;
        }
    }
    onSave(formData);
  };
  
  if (!template) return null;

  const commonInputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 dark:border-gray-600";
  const commonSelectStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600";


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('editSubmission') : `${t('fillOutForm')}: ${template.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {template.fields.filter(shouldShowField).map(field => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === FormFieldType.TEXT && (
              <input
                type="text"
                id={field.id}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className={commonInputStyles}
              />
            )}
            {field.type === FormFieldType.TEXTAREA && (
              <textarea
                id={field.id}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                rows={4}
                className={commonInputStyles}
              />
            )}
             {field.type === FormFieldType.NUMBER && (
              <input
                type="number"
                id={field.id}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className={commonInputStyles}
              />
            )}
            {field.type === FormFieldType.DATE && (
              <input
                type="date"
                id={field.id}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className={commonInputStyles}
              />
            )}
            {field.type === FormFieldType.SELECT && (
              <select
                id={field.id}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className={commonSelectStyles}
              >
                <option value="">-- {t('selectValue')} --</option>
                {field.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
          </div>
        ))}

        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
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

export default FormFillModal;