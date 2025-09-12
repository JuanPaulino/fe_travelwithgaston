import React from 'react';
import { FormField } from '../../types/form';

interface CheckboxGroupInputProps {
  field: FormField;
  value: string[];
  onChange: (name: string, value: string, type: string) => void;
  error?: string;
}

export const CheckboxGroupInput: React.FC<CheckboxGroupInputProps> = ({ 
  field, 
  value, 
  onChange, 
  error 
}) => {
  return (
    <div className="space-y-2">
      {field.choices?.map((choice) => (
        <label key={choice.value} className="flex items-center">
          <input
            type="checkbox"
            name={`${field.name}[]`}
            value={choice.value}
            checked={value.includes(choice.value)}
            onChange={(e) => onChange(field.name, choice.value, field.type)}
            className="mr-2 text-primary focus:ring-primary"
          />
          <span className="text-sm">{choice.text}</span>
        </label>
      ))}
    </div>
  );
};

