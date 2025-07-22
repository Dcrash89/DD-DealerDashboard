import React, { useMemo } from 'react';
import { WidgetConfig, FormSubmission, UserRole } from '../../../types';
import RecentSubmissionsTable from '../RecentSubmissionsTable';

interface RecentSubmissionsWidgetProps {
  config: WidgetConfig;
  submissions: FormSubmission[];
  userRole: UserRole;
  t: (key: string) => string;
}

const RecentSubmissionsWidget: React.FC<RecentSubmissionsWidgetProps> = ({ config, submissions, userRole, t }) => {
  const filteredSubmissions = useMemo(() => {
    if (!config.formTemplateId) {
      return submissions;
    }
    return submissions.filter(s => s.templateId === config.formTemplateId);
  }, [config.formTemplateId, submissions]);
  
  return (
    <RecentSubmissionsTable
      submissions={filteredSubmissions}
      t={t}
      userRole={userRole}
      limit={config.limit}
    />
  );
};

export default RecentSubmissionsWidget;
