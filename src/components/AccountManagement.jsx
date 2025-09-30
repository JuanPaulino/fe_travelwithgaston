import React, { useState } from 'react';
import Tabs from './common/Tabs';
import AccountSettings from './account/AccountSettings';
import BookingsHistory from './account/BookingsHistory';
import PaymentMethods from './account/PaymentMethods';
import UserPreferences from './account/UserPreferences';
import AuthGuard from './AuthGuard';
import { useStore } from '@nanostores/react';
import { authStore } from '../stores/authStore';
import useProfileUpdate from '../hooks/useProfileUpdate.js';

const AccountManagement = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const { updateProfile, isUpdating, error: profileError } = useProfileUpdate({
    autoUpdate: true,
    autoUpdateOnAuth: false
  });
  // Obtener datos del usuario del store
  const authState = useStore(authStore);
  const { user } = authState;

  const tabs = [
    { key: 'bookings', label: 'Bookings' },
    { key: 'manage-account', label: 'Manage account' },
    { key: 'payment-information', label: 'Payment information' },
    // { key: 'preferences', label: 'Preferences' }
  ];

  // Renderizar el contenido del tab activo
  const renderTabContent = () => {
    switch (activeTab) {
      case 'manage-account':
        return <AccountSettings />;
      
      case 'bookings':
        return <BookingsHistory />;
      
      case 'payment-information':
        return <PaymentMethods />;
      
      case 'preferences':
        return <UserPreferences />;
      
      default:
        return null;
    }
  };

  return (
    <AuthGuard redirectTo="/" requireAuth={true}>
      <div>
        {/* Header */}
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Hello, {user?.firstName || user?.name || 'User'}
          </h1>
        </div>

        {/* Tabs Component */}
        <Tabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {isUpdating && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-blue-600">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Updating profile...</span>
            </div>
          )}
          {profileError && (
            <div className="mt-4 text-sm text-red-600">
              Error: {profileError}
            </div>
          )}
          {renderTabContent()}
        </Tabs>
      </div>
    </AuthGuard>
  );
};

export default AccountManagement;
