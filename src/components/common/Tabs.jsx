import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange, children }) => {
  return (
    <div>
      {/* Tabs Navigation - Mobile First */}
      <div className="border-b border-gray-200">
        {/* Mobile: Stacked vertical tabs */}
        <div className="block sm:hidden">
          <nav className="px-4 py-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`w-full text-left py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Desktop: Traditional tabs */}
        <div className="hidden sm:block">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'border-amber-400 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 py-6 sm:px-6">
        {children}
      </div>
    </div>
  );
};

export default Tabs;
