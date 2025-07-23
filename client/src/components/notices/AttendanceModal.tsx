import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Notice, Attendee } from '../../types';
import { Icon } from '../ui/Icon';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: Notice | null;
  currentDealerId: string;
  onUpdateAttendees: (noticeId: string, dealerId: string, attendees: Attendee[]) => void;
  t: (key: string) => string;
}

const emptyAttendee = { id: '', firstName: '', lastName: '', email: '', phone: '' };

const AttendanceModal: React.FC<AttendanceModalProps> = ({ isOpen, onClose, notice, currentDealerId, onUpdateAttendees, t }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [editingAttendee, setEditingAttendee] = useState<Attendee>(emptyAttendee);
  
  const isEditing = editingAttendee.id !== '';

  useEffect(() => {
    if (isOpen && notice) {
      const existingParticipation = notice.participations.find(p => p.dealerId === currentDealerId);
      setAttendees(existingParticipation?.attendees || []);
    } else {
      setAttendees([]);
      setEditingAttendee(emptyAttendee);
    }
  }, [isOpen, notice, currentDealerId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingAttendee(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateAttendee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttendee.firstName || !editingAttendee.lastName || !editingAttendee.email) return;

    if (isEditing) {
      // Update existing
      setAttendees(prev => prev.map(att => att.id === editingAttendee.id ? editingAttendee : att));
    } else {
      // Add new
      const newAttendee = { ...editingAttendee, id: `att-${Date.now()}`};
      setAttendees(prev => [...prev, newAttendee]);
    }
    setEditingAttendee(emptyAttendee);
  };
  
  const handleEditClick = (attendee: Attendee) => {
    setEditingAttendee(attendee);
  }
  
  const handleDeleteAttendee = (attendeeId: string) => {
    setAttendees(prev => prev.filter(att => att.id !== attendeeId));
  }

  const handleSave = () => {
    if (notice) {
      onUpdateAttendees(notice.id, currentDealerId, attendees);
      onClose();
    }
  };

  if (!notice) return null;
  
  const commonInputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-dji-blue focus:border-dji-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${t('editRegistration')}: ${notice.title}`}>
      <div className="space-y-6">
        
        {/* Attendee Form */}
        <form onSubmit={handleAddOrUpdateAttendee} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
          <h4 className="font-semibold text-lg">{isEditing ? t('editAttendee') : t('addAttendee')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="firstName" value={editingAttendee.firstName} onChange={handleInputChange} placeholder={t('firstName')} required className={commonInputStyles}/>
            <input type="text" name="lastName" value={editingAttendee.lastName} onChange={handleInputChange} placeholder={t('lastName')} required className={commonInputStyles}/>
            <input type="email" name="email" value={editingAttendee.email} onChange={handleInputChange} placeholder={t('email')} required className={commonInputStyles}/>
            <input type="tel" name="phone" value={editingAttendee.phone} onChange={handleInputChange} placeholder={t('phone')} required className={commonInputStyles}/>
          </div>
          <div className="flex justify-end gap-2">
            {isEditing && <button type="button" onClick={() => setEditingAttendee(emptyAttendee)} className="px-4 py-2 text-sm font-medium rounded-md border dark:bg-gray-600 dark:border-gray-500">{t('cancel')}</button>}
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-dji-blue rounded-md flex items-center gap-2"><Icon name="plus" className="w-4 h-4"/>{isEditing ? t('save') : t('addAttendee')}</button>
          </div>
        </form>
        
        {/* Attendees List */}
        <div>
          <h4 className="font-semibold text-lg mb-2">{t('attendees')} ({attendees.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {attendees.length > 0 ? attendees.map(attendee => (
              <div key={attendee.id} className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg">
                <div>
                  <p className="font-medium">{attendee.firstName} {attendee.lastName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{attendee.email}</p>
                </div>
                <div>
                  <button onClick={() => handleEditClick(attendee)} className="p-2 text-gray-500 hover:text-dji-blue rounded-full"><Icon name="edit" className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteAttendee(attendee.id)} className="p-2 text-gray-500 hover:text-red-500 rounded-full"><Icon name="trash" className="w-4 h-4" /></button>
                </div>
              </div>
            )) : <p className="text-center text-gray-500 py-4">{t('noParticipants')}</p>}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3 border-t dark:border-gray-700 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border dark:bg-gray-600 dark:border-gray-500">{t('cancel')}</button>
          <button type="button" onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md">{t('save')} {t('registration')}</button>
        </div>
      </div>
    </Modal>
  );
};

export default AttendanceModal;