import React from 'react';

const Tabs = ({ tabs, activeTab, onTabChange, children }) => {
  return (
    <div>
      {/* Tabs Navigation */}
      <div>
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  );
};

export default Tabs;
