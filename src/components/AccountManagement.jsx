import React, { useState } from 'react';
import Tabs from './common/Tabs';
import AccountSettings from './account/AccountSettings';
import BookingsHistory from './account/BookingsHistory';
import PaymentMethods from './account/PaymentMethods';
import UserPreferences from './account/UserPreferences';

const AccountManagement = () => {
  const [activeTab, setActiveTab] = useState('manage-account');

  const tabs = [
    { key: 'bookings', label: 'Bookings' },
    { key: 'manage-account', label: 'Manage account' },
    { key: 'payment-information', label: 'Payment information' },
    { key: 'preferences', label: 'Preferences' }
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
    <div>
      {/* Header */}
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Hello, User</h1>
      </div>

      {/* Tabs Component */}
      <Tabs 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderTabContent()}
      </Tabs>
    </div>
  );
};

export default AccountManagement;
