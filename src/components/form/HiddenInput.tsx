import React from 'react';
import { FormField } from '../../types/form';

interface HiddenInputProps {
  field: FormField;
  value: string;
  onChange: (name: string, value: string, type: string) => void;
}

export const HiddenInput: React.FC<HiddenInputProps> = ({ 
  field, 
  value, 
  onChange 
}) => {
  const fieldId = `field-${field.id}`;

  return (
    <input
      type="hidden"
      id={fieldId}
      name={field.name}
      value={value}
      onChange={(e) => onChange(field.name, e.target.value, field.type)}
    />
  );
};

