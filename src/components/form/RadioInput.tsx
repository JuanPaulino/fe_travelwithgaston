import React from 'react';
import { FormField } from '../../types/form';

interface RadioInputProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string, type: string) => void;
  error?: string;
}

export const RadioInput: React.FC<RadioInputProps> = ({ 
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
            type="radio"
            name={field.name}
            value={choice.value}
            checked={value === choice.value}
            onChange={(e) => onChange(field.name, e.target.value, field.type)}
            required={field.required}
            className="mr-2 text-primary focus:ring-primary"
          />
          <span className="text-sm">{choice.text}</span>
        </label>
      ))}
    </div>
  );
};

