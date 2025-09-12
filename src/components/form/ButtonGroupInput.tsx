import React from 'react';
import { FormField } from '../../types/form';

interface ButtonGroupInputProps {
  field: FormField;
  value: string[];
  onChange: (name: string, value: string, type: string) => void;
  error?: string;
}

export const ButtonGroupInput: React.FC<ButtonGroupInputProps> = ({ 
  field, 
  value, 
  onChange, 
  error 
}) => {
  const handleButtonClick = (buttonValue: string) => {
    if (value.includes(buttonValue)) {
      // Remove if already selected
      onChange(field.name, buttonValue, field.type);
    } else {
      // Add if not selected
      onChange(field.name, buttonValue, field.type);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {field.choices?.map((choice) => (
          <button
            key={choice.value}
            type="button"
            onClick={() => handleButtonClick(choice.value)}
            className={`px-4 py-2 border border-gray-300 rounded bg-white text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              value.includes(choice.value) 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'text-gray-700'
            }`}
          >
            {choice.text}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};
