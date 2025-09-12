import React from 'react';
import { FormField } from '../../types/form';

interface FileInputProps {
  field: FormField;
  value: File | null;
  onChange: (name: string, value: File | null, type: string) => void;
  error?: string;
}

export const FileInput: React.FC<FileInputProps> = ({ 
  field, 
  value, 
  onChange, 
  error 
}) => {
  const fieldId = `field-${field.id}`;

  return (
    <input
      type="file"
      id={fieldId}
      name={field.name}
      onChange={(e) => onChange(field.name, e.target.files?.[0] || null, field.type)}
      required={field.required}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
        error ? 'border-secondary-DEFAULT' : 'border-neutral-light'
      }`}
    />
  );
};

