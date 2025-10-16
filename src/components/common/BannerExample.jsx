import React from 'react';
import { showSuccess, showError, showWarning, showInfo } from '../../stores/bannerStore';

const BannerExample = () => {
  const handleShowSuccess = () => {
    showSuccess('Operation completed successfully!', { autoHide: true });
  };

  const handleShowError = () => {
    showError('An error has occurred. Please try again.', { autoHide: true });
  };

  const handleShowWarning = () => {
    showWarning('Warning: This field is optional.', { autoHide: true });
  };

  const handleShowInfo = () => {
    showInfo('Information: Changes will be saved automatically.', { autoHide: true });
  };

  const handleShowPersistent = () => {
    showInfo('This message will not hide automatically. Click X to close it.');
  };

  const handleShowPositioned = () => {
    showSuccess('Banner en la esquina inferior izquierda!', { position: 'bottom-left', autoHide: true });
  };

  const handleShowCentered = () => {
    showWarning('Banner centrado en la parte superior!', { position: 'top-center', autoHide: true });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Banner Examples</h3>
      <div className="space-y-3">
        <button
          onClick={handleShowSuccess}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Show Success
        </button>
        
        <button
          onClick={handleShowError}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Show Error
        </button>
        
        <button
          onClick={handleShowWarning}
          className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
        >
          Show Warning
        </button>
        
        <button
          onClick={handleShowInfo}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Show Info
        </button>
        
        <button
          onClick={handleShowPersistent}
          className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          Show Persistent Info
        </button>
        
        <button
          onClick={handleShowPositioned}
          className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
        >
          Show Positioned Banner
        </button>
        
        <button
          onClick={handleShowCentered}
          className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
        >
          Show Centered Banner
        </button>
      </div>
    </div>
  );
};

export default BannerExample;
