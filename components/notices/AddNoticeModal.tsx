import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Notice, NoticePriority, NoticeType } from '../../types';

interface AddNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notice: Omit<Notice, 'id' | 'creationDate' | 'participations'>) => void;
  t: (key: string) => string;
}

const noticePriorities = Object.values(NoticePriority);
const noticeTypes = Object.values(NoticeType);

const AddNoticeModal: React.FC<AddNoticeModalProps> = ({ isOpen, onClose, onSave, t }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<NoticePriority>(NoticePriority.MEDIUM);
  const [type, setType] = useState<NoticeType>(NoticeType.GENERAL);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setTitle('');
      setContent('');
      setPriority(NoticePriority.MEDIUM);
      setType(NoticeType.GENERAL);
      setEventDate('');
      setEventTime('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return; // Basic validation
    onSave({ title, content, priority, type, eventDate, eventTime });
    onClose();
  };
  
  const commonInputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400";
  const commonSelectStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600";


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('addNotice')}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
           <div>
            <label htmlFor="noticeType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('noticeType')}
            </label>
            <select
              id="noticeType"
              value={type}
              onChange={(e) => setType(e.target.value as NoticeType)}
              className={commonSelectStyles}
            >
              {noticeTypes.map(p => <option key={p} value={p}>{t(p)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="noticeTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('title')}
            </label>
            <input
              type="text"
              id="noticeTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={commonInputStyles}
            />
          </div>
          <div>
            <label htmlFor="noticeContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('content')}
            </label>
            <textarea
              id="noticeContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className={commonInputStyles}
            />
          </div>
          {type !== NoticeType.GENERAL && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('eventDate')}</label>
                <input
                  type="date"
                  id="eventDate"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className={commonInputStyles}
                />
              </div>
               <div>
                <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('eventTime')}</label>
                <input
                  type="time"
                  id="eventTime"
                  value={eventTime}
                  onChange={e => setEventTime(e.target.value)}
                  className={commonInputStyles}
                />
              </div>
            </div>
          )}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('priority')}
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as NoticePriority)}
              className={commonSelectStyles}
            >
              {noticePriorities.map(p => <option key={p} value={p}>{t(p)}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
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

export default AddNoticeModal;