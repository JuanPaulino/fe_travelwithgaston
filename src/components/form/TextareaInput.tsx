import React from 'react';
import { FormField } from '../../types/form';
import { getValidationAttributes } from '../../lib/formUtils';

interface TextareaInputProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string, type: string) => void;
  error?: string;
}

export const TextareaInput: React.FC<TextareaInputProps> = ({ 
  field, 
  value, 
  onChange, 
  error 
}) => {
  const fieldId = `field-${field.id}`;
  const validationAttrs = getValidationAttributes(field.validation);

  return (
    <textarea
      id={fieldId}
      name={field.name}
      value={value}
      onChange={(e) => onChange(field.name, e.target.value, field.type)}
      placeholder={field.placeholder}
      required={field.required}
      rows={4}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
        error ? 'border-secondary-DEFAULT' : 'border-neutral-light'
      }`}
      {...validationAttrs}
    />
  );
};

