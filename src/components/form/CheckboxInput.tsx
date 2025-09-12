import React from 'react';
import { FormField } from '../../types/form';

interface CheckboxInputProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string, type: string) => void;
  error?: string;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({ 
  field, 
  value, 
  onChange, 
  error 
}) => {
  const fieldId = `field-${field.id}`;

  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        id={fieldId}
        name={field.name}
        checked={value === 'true'}
        onChange={(e) => onChange(field.name, e.target.checked ? 'true' : 'false', field.type)}
        required={field.required}
        className="mr-2 text-primary focus:ring-primary"
      />
      <span className="text-sm">{field.label}</span>
    </label>
  );
};

