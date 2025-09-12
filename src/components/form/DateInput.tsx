import React from 'react';
import { FormField } from '../../types/form';
import { getValidationAttributes } from '../../lib/formUtils';

interface DateInputProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string, type: string) => void;
  error?: string;
}

export const DateInput: React.FC<DateInputProps> = ({ 
  field, 
  value, 
  onChange, 
  error 
}) => {
  const fieldId = `field-${field.id}`;
  const validationAttrs = getValidationAttributes(field.validation);

  return (
    <input
      type="date"
      id={fieldId}
      name={field.name}
      value={value}
      onChange={(e) => onChange(field.name, e.target.value, field.type)}
      required={field.required}
      className={`w-full p-3 border border-gray-300 rounded bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      {...validationAttrs}
    />
  );
};
