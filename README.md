# TaskFlow CLI

Orquestrador de automações local construído com TypeScript.
Defina pipelines em YAML e execute tarefas de shell, HTTP, arquivos e notificações — em sequência ou em paralelo.

## Tecnologias

- TypeScript
- Node.js
- Zod (validação de schema)
- Commander (CLI)
- Axios (requisições HTTP)
- js-yaml (leitura de YAML)
- Ora + Chalk (terminal interativo)

## Instalação

```bash
git clone https://github.com/seu-usuario/taskflow-cli
cd taskflow-cli
npm install
```

## Como usar

### Executar um pipeline

```bash
npm run dev run example-pipeline.yaml
```

### Validar um pipeline sem executar

```bash
npm run dev validate example-pipeline.yaml
```

### Salvar relatório em JSON

```bash
npm run dev run example-pipeline.yaml --output relatorio.json
```

## Estrutura do pipeline

```yaml
name: "Nome do Pipeline"
description: "Descrição opcional"
parallel: false

tasks:
  - type: shell
    name: "Rodar comando"
    command: "node --version"

  - type: http
    name: "Chamar API"
    url: "https://api.exemplo.com/dados"
    method: GET

  - type: file
    name: "Copiar arquivo"
    action: copy
    source: "./origem.txt"
    destination: "./destino.txt"

  - type: notify
    name: "Notificação"
    message: "Tudo certo!"
    level: info
```

## Tipos de tarefa

| Tipo     | O que faz                      |
| -------- | ------------------------------ |
| `shell`  | Executa um comando no terminal |
| `http`   | Faz uma requisição HTTP        |
| `file`   | Copia, move ou deleta arquivos |
| `notify` | Exibe uma mensagem no terminal |

## Estrutura do projeto

src/

  ├── cli/ # Entrada da CLI (Commander)

  ├── parser/ # Leitura e validação do YAML com Zod

  ├── runner/ # Execução sequencial ou paralela

  ├── tasks/ # Handlers de cada tipo de tarefa

  ├── logger/ # Logs coloridos com Chalk

  └── types/ # Interfaces, Enums e Types

## Conceitos de TypeScript aplicados

| Conceito            | Onde aparece                        |
| ------------------- | ----------------------------------- |
| Enums               | `types/index.ts`                    |
| Interfaces          | `types/index.ts`                    |
| Union Types         | `types/index.ts`                    |
| Discriminated Union | `types/index.ts`, `runner/index.ts` |
| Generics            | `runner/index.ts`                   |
| Record\<K,V\>       | `types/index.ts`, `tasks/notify.ts` |
| Barrel Exports      | `tasks/index.ts`                    |
| Zod validation      | `parser/index.ts`                   |
| Promise.allSettled  | `runner/index.ts`                   |
