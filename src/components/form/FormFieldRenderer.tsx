import React from 'react';
import { FormField } from '../../types/form';
import { FormFieldWrapper } from './FormFieldWrapper';
import { TextInput } from './TextInput';
import { EmailInput } from './EmailInput';
import { TextareaInput } from './TextareaInput';
import { SelectInput } from './SelectInput';
import { RadioInput } from './RadioInput';
import { CheckboxInput } from './CheckboxInput';
import { CheckboxGroupInput } from './CheckboxGroupInput';
import { FileInput } from './FileInput';
import { HiddenInput } from './HiddenInput';
import { ButtonGroupInput } from './ButtonGroupInput';
import { DateInput } from './DateInput';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (name: string, value: any, type: string) => void;
  error?: string;
}

export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return <TextInput field={field} value={value || ''} onChange={onChange} error={error} />;
      case 'email':
        return <EmailInput field={field} value={value || ''} onChange={onChange} error={error} />;
      case 'textarea':
        return <TextareaInput field={field} value={value || ''} onChange={onChange} error={error} />;
      case 'select':
        return <SelectInput field={field} value={value || ''} onChange={onChange} error={error} />;
      case 'radio':
        return <RadioInput field={field} value={value || ''} onChange={onChange} error={error} />;
      case 'checkbox':
        return <CheckboxInput field={field} value={value || 'false'} onChange={onChange} error={error} />;
      case 'checkbox_group':
        return <CheckboxGroupInput field={field} value={value || []} onChange={onChange} error={error} />;
      case 'file':
        return <FileInput field={field} value={value || ''} onChange={onChange} error={error} />;
      case 'hidden':
        return <HiddenInput field={field} value={value || ''} onChange={onChange} error={error} />;
      case 'date':
        return <DateInput field={field} value={value || ''} onChange={onChange} error={error} />;
      case 'button_group':
        return <ButtonGroupInput field={field} value={value || []} onChange={onChange} error={error} />;
      default:
        return <TextInput field={field} value={value || ''} onChange={onChange} error={error} />;
    }
  };

  return (
    <FormFieldWrapper field={field} error={error}>
      {renderField()}
    </FormFieldWrapper>
  );
};
