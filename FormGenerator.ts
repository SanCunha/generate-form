import { FieldConfig, FormConfig, StylesConfig } from './FieldConfig';

export class FormGenerator {
  config: FormConfig;
  currentPage: number;
  totalPages: number;

  constructor(config: FormConfig) {
    this.config = config;
    this.currentPage = 1;
    this.totalPages = this.calculateTotalPages();
  }

  calculateTotalPages(): number {
    const sections = new Set(this.config.fields.map(field => field.section));
    return sections.size;
  }

  generateForm(currentPage: number): string {
    this.currentPage = currentPage;
    const styles = this.config.styles;
    let formHTML = `<form id="${this.config.formId}" method="${this.config.method}" action="${this.config.action}" style="${styles?.form ?? ''}" onsubmit="return false;">\n`;

    this.config.fields.forEach(field => {
      if (field.section === `page${this.currentPage}`) {
        formHTML += this.createField(field, styles);
      }
    });

    formHTML += this.createNavigationButtons();
    formHTML += '</form>\n';
    return formHTML;
  }

  createField(field: FieldConfig, styles?: StylesConfig): string {
    let fieldHTML = '';
    const fieldStyle = styles?.field ?? '';
    const labelStyle = styles?.label ?? '';
    const inputStyle = styles?.input ?? '';

    switch (field.type) {
      case 'text':
      case 'password':
      case 'email':
      case 'number':
        fieldHTML += this.createInputField(field, fieldStyle, labelStyle, inputStyle);
        break;
      case 'submit':
        fieldHTML += this.createSubmitField(field, fieldStyle, inputStyle);
        break;
      case 'textarea':
        fieldHTML += this.createTextareaField(field, fieldStyle, labelStyle, inputStyle);
        break;
      case 'select':
        fieldHTML += this.createSelectField(field, fieldStyle, labelStyle, inputStyle);
        break;
      default:
        console.warn(`Tipo de campo desconhecido: ${field.type}`);
        return '';
    }

    return fieldHTML;
  }

  createInputField(field: FieldConfig, fieldStyle: string, labelStyle: string, inputStyle: string): string {
    return `<div style="${fieldStyle}">\n<label style="${labelStyle}">${field.label}</label>\n<input type="${field.type}" name="${field.name}" placeholder="${field.label}" style="${inputStyle}" ${field.required ? 'required' : ''} ${field.pattern ? `pattern="${field.pattern}"` : ''} ${field.minlength ? `minlength="${field.minlength}"` : ''} ${field.maxlength ? `maxlength="${field.maxlength}"` : ''} ${field.min ? `min="${field.min}"` : ''} ${field.max ? `max="${field.max}"` : ''}>\n</div>\n`;
  }

  createSubmitField(field: FieldConfig, fieldStyle: string, inputStyle: string): string {
    return `<div style="${fieldStyle}">\n<input type="submit" value="${field.value}" style="${inputStyle}" ${this.currentPage !== this.totalPages ? 'disabled' : ''}>\n</div>\n`;
  }

  createTextareaField(field: FieldConfig, fieldStyle: string, labelStyle: string, inputStyle: string): string {
    return `<div style="${fieldStyle}">\n<label style="${labelStyle}">${field.label}</label>\n<textarea name="${field.name}" placeholder="${field.label}" style="${inputStyle}" ${field.required ? 'required' : ''} ${field.minlength ? `minlength="${field.minlength}"` : ''} ${field.maxlength ? `maxlength="${field.maxlength}"` : ''}></textarea>\n</div>\n`;
  }

  createSelectField(field: FieldConfig, fieldStyle: string, labelStyle: string, inputStyle: string): string {
    let fieldHTML = `<div style="${fieldStyle}">\n<label style="${labelStyle}">${field.label}</label>\n<select name="${field.name}" style="${inputStyle}" ${field.required ? 'required' : ''}>\n`;

    field.options?.forEach(option => {
      fieldHTML += `<option value="${option.value}">${option.label}</option>\n`;
    });

    fieldHTML += '</select>\n</div>\n';
    return fieldHTML;
  }

  createNavigationButtons(): string {
    let buttonsHTML = '<div style="text-align: center; margin-top: 20px;">';

    if (this.currentPage > 1) {
      buttonsHTML += `<button type="button" onclick="navigateTo(${this.currentPage - 1})">Anterior</button>`;
    }

    if (this.currentPage < this.totalPages) {
      buttonsHTML += `<button type="button" onclick="validateAndNavigate(${this.currentPage + 1})">Próximo</button>`;
    }

    buttonsHTML += '</div>';
    return buttonsHTML;
  }

  static validatePage(page: number, formConfig: FormConfig): boolean {
    const fields = formConfig.fields.filter(field => field.section === `page${page}` && field.required);
    for (const field of fields) {
      const element = document.querySelector(`[name="${field.name}"]`) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (element && !element.value) {
        alert(`Por favor, preencha o campo obrigatório: ${field.label}`);
        return false;
      }
    }
    return true;
  }
}
