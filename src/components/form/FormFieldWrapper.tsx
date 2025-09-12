import React from 'react';
import { FormField } from '../../types/form';
import { getWidthClass } from '../../lib/formUtils';

interface FormFieldWrapperProps {
  field: FormField;
  children: React.ReactNode;
  error?: string;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({ 
  field, 
  children, 
  error 
}) => {
  const widthClass = getWidthClass(field.width);
  const fieldId = `field-${field.id}`;

  return (
    <div className={`form-field ${widthClass} ${field.type === 'hidden' ? 'hidden' : ''}`}>
      <div className="field-wrapper">
        {/* Label */}
        {field.label && field.type !== 'checkbox' && (
          <label htmlFor={fieldId} className="block text-sm font-medium mb-2">
            {field.label}
            {field.required && <span className="text-secondary-DEFAULT ml-1">*</span>}
          </label>
        )}

        {/* Campo */}
        {children}

        {/* Texto de ayuda */}
        {field.help && (
          <p className="text-xs text-neutral-DEFAULT mt-1">
            {field.help}
          </p>
        )}

        {/* Mensaje de error */}
        {error && (
          <p className="text-xs text-secondary-DEFAULT mt-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

