import React from 'react';
import { FormSubmission, FormTemplate } from '../../types';
import { Icon } from '../ui/Icon';
import StatusBadge from '../ui/StatusBadge';

interface SubmissionsListProps {
  submissions: FormSubmission[];
  templates: FormTemplate[];
  t: (key: string) => string;
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({ submissions, templates, t }) => {
  
  const getTemplateTitle = (templateId: string) => {
    return templates.find(t => t.id === templateId)?.title || 'Unknown Form';
  };
  
  if (submissions.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <Icon name="file-text" className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
        <p className="font-semibold">{t('noSubmissions')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('templateTitle')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('submissionDate')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('status')}</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {submissions.map(submission => (
                    <tr key={submission.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{getTemplateTitle(submission.templateId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{submission.submissionDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={submission.status} t={t} /></td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-dji-blue hover:text-dji-blue-dark p-2 rounded-full hover:bg-dji-blue/10 transition-colors" title={t('details')}>
                                <Icon name="eye" className="w-5 h-5"/>
                            </button>
                        </td>
                    </tr>
                ))}
             </tbody>
          </table>
        </div>
    </div>
  );
};

export default SubmissionsList;
