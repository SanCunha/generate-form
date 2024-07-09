import * as fs from 'fs';
import { FormGenerator } from './FormGenerator';
import { FormConfig } from './FieldConfig';

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
      required: true,
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

      function validateAndNavigate(page) {
        const isValid = validatePage(currentPage);
        if (isValid) {
          navigateTo(page);
        }
      }

      function validatePage(page) {
        const fields = ${JSON.stringify(formConfig.fields)}.filter(field => field.section === \`page\${page}\` && field.required);
        for (const field of fields) {
          const element = document.querySelector(\`[name="\${field.name}"]\`);
          if (element && !element.value) {
            alert(\`Por favor, preencha o campo obrigatório: \${field.label}\`);
            return false;
          }
        }
        return true;
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

generateAndSaveForm(1);
