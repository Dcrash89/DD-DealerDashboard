import React from 'react';
import { Icon } from '../ui/Icon';

interface WidgetWrapperProps {
  children: React.ReactNode;
  title: string;
  isEditMode: boolean;
  onEdit: () => void;
  onRemove: () => void;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ children, title, isEditMode, onEdit, onRemove }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full flex flex-col p-4 relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-800 dark:text-white truncate pr-16">{title}</h3>
        {isEditMode && (
          <div className="absolute top-2 right-2 flex items-center gap-1">
             <button
              className="drag-handle cursor-move p-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Move"
            >
              <Icon name="move" className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 rounded-full text-gray-400 hover:text-dji-blue hover:bg-dji-blue/10"
              title="Configure"
            >
              <Icon name="settings" className="w-4 h-4" />
            </button>
            <button
              onClick={onRemove}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10"
              title="Remove"
            >
              <Icon name="trash" className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
};

export default WidgetWrapper;
