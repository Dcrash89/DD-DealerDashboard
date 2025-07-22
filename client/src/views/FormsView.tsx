import React, { useState, useMemo } from 'react';
import { Form, FormField, FormSubmission, FormStatus } from '../types';
import { Icon } from '../components/ui/Icon';
import FormFieldModal from '../components/forms/FormFieldModal';
import { Dropdown } from '../components/ui/Dropdown';
import { useData } from '../hooks/useData';

interface FormsViewProps {
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

type FormEditorTab = 'fields' | 'submissions';
type AdminViewTab = 'active' | 'archived';

const FormsView: React.FC<FormsViewProps> = ({ t }) => {
  const { 
    forms: formTemplates, 
    formSubmissions,
    addFormTemplate, 
    updateFormTemplate, 
    updateTemplateFields, 
    updateFormSubmission, 
    archiveFormTemplate, 
    cloneFormTemplate, 
    deleteTemplatePermanently 
  } = useData();
  
  const [editingTemplate, setEditingTemplate] = useState<Form | null>(null);
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<FormEditorTab>('fields');
  const [activeAdminTab, setActiveAdminTab] = useState<AdminViewTab>('active');

  const activeTemplates = useMemo(() => formTemplates.filter(t => !t.archived), [formTemplates]);
  const archivedTemplates = useMemo(() => formTemplates.filter(t => t.archived), [formTemplates]);

  const handleAddField = (field: FormField) => {
    if (!editingTemplate) return;
    const newFields = [...editingTemplate.fields, { ...field, id: `field-${Date.now()}` }];
    updateTemplateFields(editingTemplate.id, newFields);
  };
  
  const handleUpdateField = (updatedField: FormField) => {
    if (!editingTemplate || !editingField) return;
    const newFields = editingTemplate.fields.map(f => f.id === updatedField.id ? updatedField : f);
    updateTemplateFields(editingTemplate.id, newFields);
  };

  const handleDeleteField = (fieldId: string) => {
    if(!editingTemplate) return;
    if (window.confirm('Are you sure you want to delete this field?')) {
        const newFields = editingTemplate.fields.filter(f => f.id !== fieldId);
        updateTemplateFields(editingTemplate.id, newFields);
    }
  };

  const handleArchive = (templateId: string) => {
    if (window.confirm(t('confirmArchiveMessage'))) {
      archiveFormTemplate(templateId);
    }
  };

  const handlePermanentDelete = (templateId: string) => {
    if (window.confirm(t('confirmPermanentDeleteMessage'))) {
        deleteTemplatePermanently(templateId);
    }
  };

  const handleClone = (templateId: string) => {
    cloneFormTemplate(templateId, t);
  }

  const openEditor = (template: Form) => {
    setEditingTemplate(template);
    setActiveEditorTab('fields');
  };

  const closeEditor = () => {
    setEditingTemplate(null);
  };
  
  const getStatusOptions = () => Object.values(FormStatus).map(s => ({ value: s, label: t(s)}));
  
  const renderSubmissionsForTemplate = () => {
      if(!editingTemplate) return null;
      const submissions = formSubmissions.filter(s => s.formId === editingTemplate.id);
      
      return (
         <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {submissions.length === 0 && <p className="text-center text-gray-500 py-8">{t('noSubmissions')}</p>}
            {submissions.map(sub => (
                <div key={sub.id} className="bg-white dark:bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{sub.dealerName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('submittedOn')} {new Date(sub.submissionDate).toLocaleDateString()}</p>
                        </div>
                        <div className="w-40">
                             <Dropdown 
                                options={getStatusOptions()}
                                selectedValue={sub.status}
                                onSelect={(newStatus) => updateFormSubmission(sub.id, { status: newStatus as FormStatus })}
                             />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      );
  };

  const renderTemplateCard = (template: Form) => {
    const isArchived = template.archived;
    return (
        <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex flex-col justify-between gap-4">
            <div>
              <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex-1 pr-2">{template.title}</h3>
                  {!template.published && !isArchived && (
                    <span className="text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 px-2 py-0.5 rounded-full">Bozza</span>
                  )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 h-10 overflow-hidden">{template.description}</p>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <button
                onClick={() => openEditor(template)}
                className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <Icon name="pencil-ruler" className="w-5 h-5 mr-2" />
                {t('editTemplate')} ({template.fields.length})
              </button>
              {isArchived ? (
                <>
                  <button onClick={() => handleClone(template.id)} title={t('cloneTemplate')} className="p-2 rounded-lg bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-900/80 text-green-700 dark:text-green-300 transition-colors">
                    <Icon name="copy" className="w-5 h-5"/>
                  </button>
                  <button onClick={() => handlePermanentDelete(template.id)} title={t('permanentDelete')} className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/80 text-red-700 dark:text-red-300 transition-colors">
                    <Icon name="trash" className="w-5 h-5"/>
                  </button>
                </>
              ) : (
                <button onClick={() => handleArchive(template.id)} title={t('archive')} className="p-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:hover:bg-yellow-900/80 text-yellow-700 dark:text-yellow-300 transition-colors">
                    <Icon name="archive" className="w-5 h-5"/>
                </button>
              )}
            </div>
          </div>
    );
  };
  
  const NoTemplatesMessage: React.FC<{isArchived: boolean}> = ({isArchived}) => (
     <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
        <Icon name={isArchived ? "archive" : "forms"} className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p className="font-semibold">{t(isArchived ? 'noArchivedTemplates' : 'noActiveTemplates')}</p>
      </div>
  )

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('formTemplates')}</h2>
        <button
          onClick={() => addFormTemplate({ title: t('templateTitle'), description: '' })}
          className="flex items-center bg-dji-blue hover:bg-dji-blue-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          <Icon name="plus" className="w-5 h-5 mr-2" />
          {t('createTemplate')}
        </button>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              <button onClick={() => setActiveAdminTab('active')} className={`${activeAdminTab === 'active' ? 'border-dji-blue text-dji-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>{t('activeForms')} ({activeTemplates.length})</button>
              <button onClick={() => setActiveAdminTab('archived')} className={`${activeAdminTab === 'archived' ? 'border-dji-blue text-dji-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>{t('archivedForms')} ({archivedTemplates.length})</button>
          </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeAdminTab === 'active' && (
            activeTemplates.length > 0 ? activeTemplates.map(renderTemplateCard) : <NoTemplatesMessage isArchived={false}/>
        )}
        {activeAdminTab === 'archived' && (
            archivedTemplates.length > 0 ? archivedTemplates.map(renderTemplateCard) : <NoTemplatesMessage isArchived={true}/>
        )}
      </div>

      {editingTemplate && (
         <div className="fixed inset-0 bg-black/60 z-40" onClick={closeEditor}>
            <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-gray-50 dark:bg-gray-900 shadow-2xl z-50 p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-4 dark:border-gray-700">
                    <h3 className="text-xl font-bold">{t('editTemplate')}</h3>
                    <button onClick={closeEditor} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Icon name="close"/></button>
                </div>
                
                <div className="space-y-4 my-6">
                     <div>
                        <label className="text-sm font-medium">{t('templateTitle')}</label>
                        <input type="text" value={editingTemplate.title} onChange={e => updateFormTemplate(editingTemplate.id, {title: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-dji-blue focus:border-dji-blue"/>
                     </div>
                     <div>
                        <label className="text-sm font-medium">{t('templateDescription')}</label>
                        <textarea value={editingTemplate.description} onChange={e => updateFormTemplate(editingTemplate.id, {description: e.target.value})} className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-dji-blue focus:border-dji-blue" rows={3}></textarea>
                     </div>
                      <div className="flex items-center space-x-8">
                        <div className="flex items-center">
                            <input
                                id="isPublished"
                                type="checkbox"
                                checked={editingTemplate.published}
                                onChange={(e) => updateFormTemplate(editingTemplate.id, { published: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-dji-blue focus:ring-dji-blue"
                            />
                            <label htmlFor="isPublished" className="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                                Pubblicato
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="dealerCanEditSubmissions"
                                type="checkbox"
                                checked={editingTemplate.dealerCanEditSubmissions}
                                onChange={(e) => updateFormTemplate(editingTemplate.id, { dealerCanEditSubmissions: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-dji-blue focus:ring-dji-blue"
                            />
                            <label htmlFor="dealerCanEditSubmissions" className="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-300">
                                {t('allowDealerEdits')}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                        <button onClick={() => setActiveEditorTab('fields')} className={`${activeEditorTab === 'fields' ? 'border-dji-blue text-dji-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>{t('fields')}</button>
                        <button onClick={() => setActiveEditorTab('submissions')} className={`${activeEditorTab === 'submissions' ? 'border-dji-blue text-dji-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>{t('submissions')}</button>
                    </nav>
                </div>
                
                {activeEditorTab === 'fields' ? (
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 py-4">
                      {editingTemplate.fields.map(field => (
                          <div key={field.id} className="bg-white dark:bg-gray-700/50 p-3 rounded-lg flex items-center justify-between">
                              <div>
                                  <p className="font-semibold">{field.label}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{t(field.type)}{field.required ? ' *' : ''}</p>
                              </div>
                              <div>
                                  <button onClick={() => { setEditingField(field); setIsFieldModalOpen(true); }} className="p-2 text-gray-500 hover:text-dji-blue rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><Icon name="edit" className="w-4 h-4"/></button>
                                  <button onClick={() => handleDeleteField(field.id)} className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><Icon name="trash" className="w-4 h-4"/></button>
                              </div>
                          </div>
                      ))}
                      <button onClick={() => { setEditingField(null); setIsFieldModalOpen(true); }} className="w-full mt-4 flex items-center justify-center bg-dji-blue/10 hover:bg-dji-blue/20 text-dji-blue font-bold py-2 px-4 rounded-lg transition-colors">
                          <Icon name="plus" className="w-5 h-5 mr-2" /> {t('addFormField')}
                      </button>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto py-4">
                    {renderSubmissionsForTemplate()}
                  </div>
                )}
            </div>
         </div>
      )}
      <FormFieldModal
        isOpen={isFieldModalOpen}
        onClose={() => setIsFieldModalOpen(false)}
        onSave={editingField ? handleUpdateField : handleAddField}
        t={t}
        fieldToEdit={editingField}
        template={editingTemplate}
      />
    </>
  );
};

export default FormsView;