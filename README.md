# Form Generator

Este projeto é um gerador de formulários em HTML usando TypeScript. Ele permite criar formulários divididos em páginas, com navegação entre páginas e validação de campos obrigatórios.

## Estrutura do Projeto

- `src/`
  - `FieldConfig.ts`: Define as interfaces de configuração do formulário e dos campos.
  - `FormGenerator.ts`: Classe responsável por gerar o HTML do formulário com base na configuração.
  - `generateForm.ts`: Script principal que utiliza `FormGenerator` para gerar e salvar o formulário em um arquivo HTML.

## Requisitos

- Node.js v14 ou superior
- npm (Node Package Manager) v6 ou superior

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/usuario/form-generator.git
   cd form-generator
2. Instale as dependências do projeto:
   ```bash
   npm install
3. Compile o código TypeScript para JavaScript:
   ```bash
   npx tsc

## Execução
1. Execute o script principal para gerar o formulário HTML
	```bash
	node dist/generateForm.js
2. O formulário gerado será salvo no arquivo formulario.html na raiz do projeto.

