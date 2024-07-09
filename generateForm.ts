import * as fs from 'fs';

interface FieldConfig {
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

interface StylesConfig {
  form?: string;
  field?: string;
  label?: string;
  input?: string;
}

interface FormConfig {
  formId: string;
  method: string;
  action: string;
  styles?: StylesConfig;
  fields: FieldConfig[];
}

class FormGenerator {
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
    let formHTML = `<form id="${this.config.formId}" method="${this.config.method}" action="${this.config.action}" style="${styles?.form ?? ''}">\n`;

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
        fieldHTML += `<div style="${fieldStyle}">\n<label style="${labelStyle}">${field.label}</label>\n<input type="${field.type}" name="${field.name}" placeholder="${field.label}" style="${inputStyle}" ${field.required ? 'required' : ''} ${field.pattern ? `pattern="${field.pattern}"` : ''} ${field.minlength ? `minlength="${field.minlength}"` : ''} ${field.maxlength ? `maxlength="${field.maxlength}"` : ''} ${field.min ? `min="${field.min}"` : ''} ${field.max ? `max="${field.max}"` : ''}>\n</div>\n`;
        break;

      case 'submit':
        fieldHTML += `<div style="${fieldStyle}">\n<input type="submit" value="${field.value}" style="${inputStyle}" ${this.currentPage !== this.totalPages ? 'disabled' : ''}>\n</div>\n`;
        break;

      case 'textarea':
        fieldHTML += `<div style="${fieldStyle}">\n<label style="${labelStyle}">${field.label}</label>\n<textarea name="${field.name}" placeholder="${field.label}" style="${inputStyle}" ${field.required ? 'required' : ''} ${field.minlength ? `minlength="${field.minlength}"` : ''} ${field.maxlength ? `maxlength="${field.maxlength}"` : ''}></textarea>\n</div>\n`;
        break;

      case 'select':
        fieldHTML += `<div style="${fieldStyle}">\n<label style="${labelStyle}">${field.label}</label>\n<select name="${field.name}" style="${inputStyle}">\n`;

        field.options?.forEach(option => {
          fieldHTML += `<option value="${option.value}">${option.label}</option>\n`;
        });

        fieldHTML += '</select>\n</div>\n';
        break;

      default:
        console.warn(`Tipo de campo desconhecido: ${field.type}`);
        return '';
    }

    return fieldHTML;
  }

  createNavigationButtons(): string {
    let buttonsHTML = '<div style="text-align: center; margin-top: 20px;">';

    if (this.currentPage > 1) {
      buttonsHTML += `<button type="button" onclick="navigateTo(${this.currentPage - 1})">Anterior</button>`;
    }

    if (this.currentPage < this.totalPages) {
      buttonsHTML += `<button type="button" onclick="navigateTo(${this.currentPage + 1})">Próximo</button>`;
    }

    buttonsHTML += '</div>';
    return buttonsHTML;
  }
}

// Exemplo de uso
const formConfig: FormConfig = {
  formId: "meuFormulario",
  method: "POST",
  action: "/submit",
  styles: {
    form: "border: 1px solid #ccc; padding: 20px;",
    field: "margin-bottom: 10px;",
    label: "font-weight: bold;",
    input: "padding: 5px; width: 100%;"
  },
  fields: [
    {
      type: "text",
      name: "username",
      label: "Nome de Usuário",
      required: true,
      pattern: "^[a-zA-Z0-9_]{1,15}$",
      section: "page1",
      style: "input-style"
    },
    {
      type: "password",
      name: "password",
      label: "Senha",
      required: true,
      minlength: 6,
      section: "page1",
      style: "input-style"
    },
    {
      type: "email",
      name: "email",
      label: "Email",
      required: true,
      section: "page2",
      style: "input-style"
    },
    {
      type: "number",
      name: "age",
      label: "Idade",
      required: true,
      min: 18,
      max: 100,
      section: "page2",
      style: "input-style"
    },
    {
      type: "textarea",
      name: "bio",
      label: "Biografia",
      required: true,
      minlength: 10,
      maxlength: 500,
      section: "page3",
      style: "input-style"
    },
    {
      type: "select",
      name: "gender",
      label: "Gênero",
      options: [
        { value: "male", label: "Masculino" },
        { value: "female", label: "Feminino" },
        { value: "other", label: "Outro" }
      ],
      section: "page3",
      style: "input-style"
    },
    {
      type: "submit",
      value: "Enviar",
      section: "page3",
      style: "input-style"
    }
  ]
};

const formGenerator = new FormGenerator(formConfig);
let currentPage = 1;

const generateAndSaveForm = (page: number) => {
  const formHTML = formGenerator.generateForm(page);
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulário Gerado</title>
    <script>
      let currentPage = ${page};
      const totalPages = ${formGenerator.totalPages};

      function navigateTo(page) {
        currentPage = page;
        document.getElementById('formContainer').innerHTML = generateForm(currentPage);
      }

      function generateForm(page) {
        const formGenerator = new (${formGenerator.constructor.toString()})(${JSON.stringify(formConfig)});
        return formGenerator.generateForm(page);
      }
    </script>
  </head>
  <body>
    <div id="formContainer">
      ${formHTML}
    </div>
  </body>
  </html>
  `;

  fs.writeFileSync('formulario.html', htmlContent);
};

generateAndSaveForm(currentPage);
