import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "warning" }) => {
  if (!isOpen) return null;

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return {
          confirm: 'bg-red-600 hover:bg-red-700 text-white',
          cancel: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        };
      case 'warning':
        return {
          confirm: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          cancel: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        };
      default:
        return {
          confirm: 'bg-black hover:bg-gray-800 text-white',
          cancel: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${buttonStyles.confirm}`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${buttonStyles.cancel}`}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
