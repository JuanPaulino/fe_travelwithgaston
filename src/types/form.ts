// Tipos basados en los modelos de Directus

export interface FormField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'checkbox' | 'checkbox_group' | 'radio' | 'file' | 'select' | 'hidden' | 'email' | 'date' | 'button_group';
  label: string;
  placeholder?: string;
  help?: string;
  validation?: string;
  width: '100' | '67' | '50' | '33';
  choices?: Array<{ text: string; value: string }>;
  form: string;
  sort: number;
  required: boolean;
  date_created: string;
  user_created: string;
  date_updated: string;
  user_updated: string;
}

export interface Form {
  id: string;
  on_success: 'redirect' | 'message';
  sort: number;
  submit_label: string;
  success_message: string;
  title: string;
  success_redirect_url?: string;
  is_active: boolean;
  emails?: Array<any>;
  date_created: string;
  user_created: string;
  date_updated: string;
  user_updated: string;
  fields: FormField[];
  submissions: FormSubmission[];
}

export interface FormSubmission {
  id: string;
  timestamp: string;
  form: string;
  values: FormSubmissionValue[];
}

export interface FormSubmissionValue {
  id: string;
  form_submission: string;
  field: string;
  value: string;
  sort: number;
  file?: string;
  timestamp: string;
}

export interface FormBlockData {
  headline?: string;
  tagline?: string;
  form: Form;
}

export interface FormFieldProps {
  field: FormField;
  value: any;
  error?: string;
  onChange: (name: string, value: any, type: string) => void;
}

export interface FormValidation {
  [fieldName: string]: string | null;
}

export interface FormState {
  formData: Record<string, any>;
  errors: FormValidation;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
}

