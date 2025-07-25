import React from 'react';
import Modal from '../ui/Modal';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, t }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('passwordResetSuccess')}>
      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('passwordResetSuccess')}</p>
        <div className="flex justify-center pt-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-dji-blue rounded-md">
            {t('close')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
