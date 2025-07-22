import React from 'react';
import Modal from '../ui/Modal';
import { FormSubmission, FormTemplate } from '../../types';
import StatusBadge from '../ui/StatusBadge';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  submission: FormSubmission | null;
  template: FormTemplate | undefined;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
    <p className="text-gray-800 dark:text-gray-200">{value || '-'}</p>
  </div>
);

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isOpen, onClose, t, submission, template }) => {
  if (!submission || !template) return null;

  const getSubmissionTitle = () => {
    const firstTextFieldValue = Object.values(submission.data)[0];
    return firstTextFieldValue || t('formSubmission');
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('eventDetails')}>
      <div className="space-y-5">
        <div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{getSubmissionTitle()}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('dealer')}: <span className="font-semibold">{submission.dealerName}</span></p>
        </div>
        
        <div className="flex items-center gap-4">
            <StatusBadge status={submission.status} t={t} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('submittedOn')}: {submission.submissionDate}
            </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {template.fields.map(field => (
                <DetailItem key={field.id} label={field.label} value={submission.data[field.id]} />
            ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EventDetailsModal;