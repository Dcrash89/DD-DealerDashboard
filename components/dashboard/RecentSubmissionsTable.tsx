
import React from 'react';
import { FormSubmission, UserRole } from '../../types';
import StatusBadge from '../ui/StatusBadge';

interface RecentSubmissionsTableProps {
  submissions: FormSubmission[];
  t: (key: string) => string;
  userRole: UserRole | 'ADMIN' | 'DEALER' | 'GUEST';
  limit?: number;
}

const RecentSubmissionsTable: React.FC<RecentSubmissionsTableProps> = ({ submissions, t, userRole, limit = 5 }) => {
  
  const getSubmissionTitle = (submission: FormSubmission) => {
    // Attempt to find the first text field value to use as a title
    const firstTextFieldValue = Object.values(submission.data)[0];
    return typeof firstTextFieldValue === 'string' && firstTextFieldValue.trim() !== ''
        ? firstTextFieldValue
        : t('formSubmission');
  }
  
  const displayedSubmissions = submissions.slice(0, limit);
  const isAdmin = userRole.toUpperCase() === 'ADMIN';

  return (
    <div className="overflow-x-auto h-full">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            {isAdmin && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {t('dealer')}
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('activityName')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('type')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('status')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t('date')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {displayedSubmissions.length > 0 ? displayedSubmissions.map((submission) => (
            <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
              {isAdmin && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {submission.dealerName}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{getSubmissionTitle(submission)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{submission.goalValue ? t(submission.goalValue) : '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusBadge status={submission.status} t={t} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{submission.submissionDate}</td>
            </tr>
          )) : (
             <tr>
                <td colSpan={isAdmin ? 5 : 4} className="text-center py-6 text-sm text-gray-500">
                  {t('noSubmissions')}
                </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentSubmissionsTable;
