import React from 'react';
import { FormField } from '../../types/form';
import { getValidationAttributes } from '../../lib/formUtils';

interface TextInputProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string, type: string) => void;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ 
  field, 
  value, 
  onChange, 
  error 
}) => {
  const fieldId = `field-${field.id}`;
  const validationAttrs = getValidationAttributes(field.validation);

  return (
    <input
      type="text"
      id={fieldId}
      name={field.name}
      value={value}
      onChange={(e) => onChange(field.name, e.target.value, field.type)}
      placeholder={field.placeholder}
      required={field.required}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
        error ? 'border-secondary-DEFAULT' : 'border-neutral-light'
      }`}
      {...validationAttrs}
    />
  );
};

