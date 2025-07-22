import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FormSubmission, Form, FormField, FormFieldType } from '../types';
import { Icon } from '../components/ui/Icon';
import FormFillModal from '../components/forms/FormFillModal';
import ValueBadge from '../components/ui/ValueBadge';
import Portal from '../components/ui/Portal';
import { useData } from '../hooks/useData';

interface MySubmissionsViewProps {
  t: (key: string) => string;
}

const MySubmissionsView: React.FC<MySubmissionsViewProps> = ({ t }) => {
  const { formSubmissions, forms, updateFormSubmission } = useData();
  
  const templatesWithSubmissions = useMemo(() => {
    const templateIds = new Set(formSubmissions.map(s => s.formId));
    return forms.filter(t => templateIds.has(t.id) && !t.archived);
  }, [formSubmissions, forms]);

  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(templatesWithSubmissions[0]?.id || null);
  const [editingSubmission, setEditingSubmission] = useState<FormSubmission | null>(null);
  
  const [quickEditState, setQuickEditState] = useState<{ submissionId: string; fieldId: string; } | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; openUp: boolean; }>({ top: 0, left: 0, openUp: false });
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (templatesWithSubmissions.length > 0 && !activeTemplateId) {
      setActiveTemplateId(templatesWithSubmissions[0].id);
    } else if (templatesWithSubmissions.length === 0) {
      setActiveTemplateId(null);
    }
  }, [templatesWithSubmissions, activeTemplateId]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setQuickEditState(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const activeTemplate = useMemo(() => {
    return forms.find(t => t.id === activeTemplateId);
  }, [activeTemplateId, forms]);

  const submissionsForActiveTemplate = useMemo(() => {
    if (!activeTemplateId) return [];
    return formSubmissions.filter(s => s.formId === activeTemplateId);
  }, [formSubmissions, activeTemplateId]);


  const handleEditSubmission = (submission: FormSubmission) => {
    setEditingSubmission(submission);
  };
  
  const handleSaveSubmissionUpdate = (data: Record<string, any>) => {
    if(!editingSubmission) return;
    updateFormSubmission(editingSubmission.id, { data });
    setEditingSubmission(null);
  }
  
  const handleQuickEditOpen = (event: React.MouseEvent<HTMLButtonElement>, submissionId: string, fieldId: string) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const estimatedDropdownHeight = 160;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < estimatedDropdownHeight && rect.top > estimatedDropdownHeight;

    setDropdownPosition({
        top: openUp ? rect.top : rect.bottom,
        left: rect.left,
        openUp,
    });
    setQuickEditState({ submissionId, fieldId });
  };

  const handleQuickEditChange = (submission: FormSubmission, fieldId: string, newValue: any) => {
    const oldData = submission.data;
    const newData = { ...oldData, [fieldId]: newValue };

    let needsFullModal = false;
    if (activeTemplate) {
        for (const field of activeTemplate.fields) {
            if (field.conditions && field.conditions.length > 0) {
                const wasVisible = field.conditions.every(c => oldData[c.fieldId] == c.value);
                const isVisible = field.conditions.every(c => newData[c.fieldId] == c.value);
                if (!wasVisible && isVisible && field.required && !newData[field.id]) {
                    needsFullModal = true;
                    break;
                }
            }
        }
    }
    
    setQuickEditState(null);

    if (needsFullModal) {
        const submissionWithChange = {...submission, data: newData};
        setEditingSubmission(submissionWithChange);
    } else {
        updateFormSubmission(submission.id, { data: newData });
    }
  }

  const renderValue = (submission: FormSubmission, field: FormField) => {
    const value = submission.data[field.id];
    
    if(field.type === FormFieldType.SELECT && activeTemplate?.dealerCanEditSubmissions) {
      return (
        <button onClick={(e) => handleQuickEditOpen(e, submission.id, field.id)}>
            <ValueBadge value={field.options?.find(opt => opt.value === value)?.label || value} />
        </button>
      );
    }

    if (field.type === FormFieldType.SELECT) {
        return <ValueBadge value={field.options?.find(opt => opt.value === value)?.label || value} />;
    }
    return value || '-';
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('mySubmissions')}</h2>
      </div>

      {templatesWithSubmissions.length > 0 ? (
        <div className="flex flex-col">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-4 overflow-x-auto" aria-label="Tabs">
                    {templatesWithSubmissions.map(template => (
                        <button 
                            key={template.id}
                            onClick={() => setActiveTemplateId(template.id)}
                            className={`${activeTemplateId === template.id ? 'border-dji-blue text-dji-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {template.title}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('submissionDate')}</th>
                                {activeTemplate?.fields.map(field => (
                                    <th key={field.id} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{field.label}</th>
                                ))}
                                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {submissionsForActiveTemplate.map(submission => (
                                <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(submission.submissionDate).toLocaleDateString()}</td>
                                    {activeTemplate?.fields.map(field => (
                                        <td key={field.id} className="px-4 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{renderValue(submission, field)}</td>
                                    ))}
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {activeTemplate?.dealerCanEditSubmissions && (
                                             <button onClick={() => handleEditSubmission(submission)} className="text-dji-blue hover:text-dji-blue-dark p-2 rounded-full hover:bg-dji-blue/10 transition-colors" title={t('edit')}>
                                                <Icon name="edit" className="w-5 h-5"/>
                                             </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      ) : (
         <div className="text-center py-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <Icon name="file-text" className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="font-semibold">{t('noSubmissions')}</p>
        </div>
      )}

      {quickEditState && (
        <Portal>
            {(() => {
                const { submissionId, fieldId } = quickEditState;
                const submission = submissionsForActiveTemplate.find(s => s.id === submissionId);
                const field = activeTemplate?.fields.find(f => f.id === fieldId);
                if (!submission || !field || field.type !== FormFieldType.SELECT) return null;

                return (
                    <div
                        ref={dropdownRef}
                        className="absolute w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transform"
                        style={{
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                            transform: dropdownPosition.openUp ? 'translateY(-100%)' : 'translateY(4px)',
                        }}
                    >
                        <div className="py-1 max-h-48 overflow-y-auto">
                            {field.options?.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleQuickEditChange(submission, field.id, opt.value)}
                                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })()}
        </Portal>
      )}

      {editingSubmission && (
        <FormFillModal
            isOpen={!!editingSubmission}
            onClose={() => setEditingSubmission(null)}
            onSave={handleSaveSubmissionUpdate}
            template={forms.find(t => t.id === editingSubmission.formId) || null}
            submissionToEdit={editingSubmission}
            t={t}
        />
      )}
    </>
  );
};

export default MySubmissionsView;