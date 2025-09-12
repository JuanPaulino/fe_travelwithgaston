import React from 'react';
import { FormField } from '../../types/form';

interface SelectInputProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string, type: string) => void;
  error?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({ 
  field, 
  value, 
  onChange, 
  error 
}) => {
  const fieldId = `field-${field.id}`;

  return (
    <select
      id={fieldId}
      name={field.name}
      value={value}
      onChange={(e) => onChange(field.name, e.target.value, field.type)}
      required={field.required}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
        error ? 'border-secondary-DEFAULT' : 'border-neutral-light'
      }`}
    >
      <option value="">Seleccionar...</option>
      {field.choices?.map((choice) => (
        <option key={choice.value} value={choice.value}>
          {choice.text}
        </option>
      ))}
    </select>
  );
};

