import React, { useState, useEffect } from 'react';
import { Notice, NoticeType } from '../types';
import { Icon } from '../components/ui/Icon';
import AddNoticeModal from '../components/notices/AddNoticeModal';
import PriorityBadge from '../components/notices/PriorityBadge';
import AttendanceModal from '../components/notices/AttendanceModal';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';

interface NoticesViewProps {
  t: (key: string) => string;
}

const NoticesView: React.FC<NoticesViewProps> = ({ t }) => {
  const { user } = useAuth();
  const { notices, dealers, readNoticeIds, currentDealer, addNotice, deleteNotice, handleWebinarConfirmation, handleUpdateAttendees, markNoticesAsRead } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedNoticeForAttendance, setSelectedNoticeForAttendance] = useState<Notice | null>(null);

  useEffect(() => {
    if (user?.role === 'DEALER') {
      const unreadIds = notices.filter(n => !readNoticeIds.has(n.id)).map(n => n.id);
      if (unreadIds.length > 0) {
        markNoticesAsRead(unreadIds);
      }
    }
  }, [notices, user?.role, readNoticeIds, markNoticesAsRead]);

  const handleDelete = (noticeId: string) => {
    if (window.confirm(t('confirmDeleteNoticeMessage'))) {
      deleteNotice(noticeId);
    }
  };
  
  const handleOpenAttendanceModal = (notice: Notice) => {
    setSelectedNoticeForAttendance(notice);
    setIsAttendanceModalOpen(true);
  }

  const getDealerNameById = (dealerId: string): string => {
    return dealers.find(d => d.id === dealerId)?.name || 'Unknown';
  }

  const renderNoticeItem = (notice: Notice) => {
    const isRead = readNoticeIds.has(notice.id);
    const participation = currentDealer ? notice.participations.find(p => p.dealerId === currentDealer.id) : undefined;
    const hasConfirmed = !!participation;

    return (
      <div key={notice.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex flex-col gap-3 relative">
        {!isRead && user?.role === 'DEALER' && (
          <span className="absolute top-4 right-4 w-3 h-3 bg-dji-blue rounded-full" title="Non letto"></span>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2">
             <PriorityBadge priority={notice.priority} t={t} />
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">{notice.title}</h3>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
            {notice.type !== NoticeType.GENERAL && notice.eventDate && (
                <span className="whitespace-nowrap">{new Date(notice.eventDate).toLocaleDateString()}</span>
            )}
            {notice.type !== NoticeType.GENERAL && notice.eventTime && (
                <span className="whitespace-nowrap">{notice.eventTime}</span>
            )}
            <span className="whitespace-nowrap">{new Date(notice.creationDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{notice.content}</p>

        {user?.role === 'ADMIN' && (
          <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-3">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase flex items-center gap-2">
                        <Icon name="users" className="w-4 h-4"/>
                        {t('attendees')} ({notice.participations.reduce((sum, p) => sum + (p.attendees.length || (notice.type === 'WEBINAR' ? 1 : 0)), 0)})
                    </h4>
                    {notice.type !== NoticeType.GENERAL && (
                        <div className="flex flex-col gap-2">
                            {notice.participations.length > 0 ? (
                                notice.participations.map(p => (
                                    <div key={p.dealerId}>
                                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{getDealerNameById(p.dealerId)}:</span>
                                      {p.attendees.length > 0 ? (
                                          <ul className="list-disc list-inside ml-2 text-sm text-gray-600 dark:text-gray-400">
                                            {p.attendees.map(a => <li key={a.id}>{`${a.firstName} ${a.lastName} (${a.email})`}</li>)}
                                          </ul>
                                      ) : <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">Confermato</span>}
                                    </div>
                                ))
                            ) : <p className="text-xs text-gray-400 dark:text-gray-500">{t('noParticipants')}</p>}
                        </div>
                    )}
                </div>
                 <button onClick={() => handleDelete(notice.id)} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors self-start" title={t('deleteNotice')}>
                    <Icon name="trash" className="w-5 h-5" />
                </button>
            </div>
          </div>
        )}

        {user?.role === 'DEALER' && notice.type === NoticeType.WEBINAR && currentDealer && (
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => handleWebinarConfirmation(notice.id, currentDealer.id, !hasConfirmed)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                hasConfirmed 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-dji-blue hover:bg-dji-blue-dark text-white'
              }`}
            >
              <Icon name="check" className="w-4 h-4" />
              {hasConfirmed ? t('participationConfirmed') : t('confirmParticipation')}
            </button>
          </div>
        )}

        {user?.role === 'DEALER' && notice.type === NoticeType.IN_PERSON_EVENT && currentDealer && (
            <div className="mt-2 flex justify-end items-center gap-4">
                {hasConfirmed && (
                    <p className="text-sm text-green-600 font-semibold">{t('attendees')}: {participation?.attendees.length}</p>
                )}
                <button
                onClick={() => handleOpenAttendanceModal(notice)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                    hasConfirmed ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-dji-blue hover:bg-dji-blue-dark text-white'
                }`}
                >
                <Icon name="user-plus" className="w-4 h-4" />
                {hasConfirmed ? t('manageRegistration') : t('registerAttendees')}
                </button>
            </div>
        )}
      </div>
    );
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('noticeManagement')}</h2>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center bg-dji-blue hover:bg-dji-blue-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
          >
            <Icon name="bell" className="w-5 h-5 mr-2" />
            {t('addNotice')}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notices.length > 0 ? (
            notices.map(renderNoticeItem)
        ) : (
             <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Icon name="bell" className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                {t('noNoticesFound')}
            </div>
        )}
      </div>

      {user?.role === 'ADMIN' && (
        <AddNoticeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={addNotice}
          t={t}
        />
      )}
      
      {currentDealer && <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        notice={selectedNoticeForAttendance}
        currentDealerId={currentDealer.id}
        onUpdateAttendees={handleUpdateAttendees}
        t={t}
      />}
    </>
  );
};

export default NoticesView;