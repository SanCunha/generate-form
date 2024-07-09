export interface FieldConfig {
    type: string;
    name?: string;
    label?: string;
    value?: string;
    required?: boolean;
    pattern?: string;
    minlength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
    options?: { value: string; label: string }[];
    style?: string;
    section?: string;
  }
  
  export interface StylesConfig {
    form?: string;
    field?: string;
    label?: string;
    input?: string;
  }
  
  export interface FormConfig {
    formId: string;
    method: string;
    action: string;
    styles?: StylesConfig;
    fields: FieldConfig[];
  }
  