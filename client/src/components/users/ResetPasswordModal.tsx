import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { Icon } from '../ui/Icon';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  newPassword?: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, t, newPassword }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('passwordResetSuccess')}>
      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('newPasswordIs')}</p>
        <div className="relative p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
          <code className="font-mono text-lg font-bold text-dji-blue">{newPassword}</code>
          <button onClick={handleCopy} className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
            {copied ? <Icon name="check" className="w-5 h-5 text-green-500"/> : <Icon name="copy" className="w-5 h-5"/>}
          </button>
        </div>
        <p className="text-xs text-gray-500">{t('copyPasswordNote')}</p>
        <div className="flex justify-center pt-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-dji-blue rounded-md">{t('close')}</button>
        </div>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
