
import React, { useState } from 'react';
import { FormTemplate, Dealer, FormSubmission } from '../types';
import { Icon } from '../components/ui/Icon';
import FormFillModal from '../components/forms/FormFillModal';

interface AvailableFormsViewProps {
  t: (key: string) => string;
  formTemplates: FormTemplate[];
  currentDealer: Dealer | null;
  onAddFormSubmission: (submissionData: Omit<FormSubmission, 'id' | 'submissionDate' | 'dealerName' | 'status' | 'goalValue' | 'eventDate'>) => void;
}

const AvailableFormsView: React.FC<AvailableFormsViewProps> = ({ t, formTemplates, currentDealer, onAddFormSubmission }) => {
  const [isFillModalOpen, setIsFillModalOpen] = useState(false);
  const [selectedTemplateToFill, setSelectedTemplateToFill] = useState<FormTemplate | null>(null);

  const handleFillForm = (template: FormTemplate) => {
    setSelectedTemplateToFill(template);
    setIsFillModalOpen(true);
  };

  const handleSaveSubmission = (data: Record<string, any>) => {
    if (!selectedTemplateToFill || !currentDealer) return;
    onAddFormSubmission({
      templateId: selectedTemplateToFill.id,
      dealerId: currentDealer.id,
      data,
    });
    setIsFillModalOpen(false);
    setSelectedTemplateToFill(null);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{t('availableForms')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formTemplates.length > 0 ? formTemplates.map(template => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex flex-col justify-between gap-4 transition-transform hover:scale-105 duration-200">
            <div>
              <Icon name="forms" className="w-8 h-8 text-dji-blue mb-3" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{template.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 h-10 overflow-hidden">{template.description}</p>
            </div>
            <button
              onClick={() => handleFillForm(template)}
              className="w-full mt-auto flex items-center justify-center bg-dji-blue hover:bg-dji-blue-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <Icon name="edit" className="w-5 h-5 mr-2" />
              {t('fillOutForm')}
            </button>
          </div>
        )) : (
            <div className="col-span-full text-center py-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <Icon name="file-text" className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="font-semibold">{t('noFormsAvailable')}</p>
          </div>
        )}
      </div>

      <FormFillModal 
        isOpen={isFillModalOpen}
        onClose={() => setIsFillModalOpen(false)}
        onSave={handleSaveSubmission}
        template={selectedTemplateToFill}
        t={t}
      />
    </>
  );
};

export default AvailableFormsView;
