import fs from "fs";
import yaml from "js-yaml";
import { z } from "zod";
import { Pipeline, TaskType } from "../types";

const ShellTaskSchema = z.object({
  type: z.literal(TaskType.SHELL),
  name: z.string().min(1, "Nome da tarefa não pode ser vazio"),
  command: z.string().min(1, "Comando não pode ser vazio"),
  workingDir: z.string().optional(),
});

const HttpTaskSchema = z.object({
  type: z.literal(TaskType.HTTP),
  name: z.string().min(1),
  url: z.string().url("URL inválida"),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  body: z.record(z.string(), z.unknown()).optional(),
  headers: z.record(z.string(), z.string()).optional(),
});

const FileTaskSchema = z.object({
  type: z.literal(TaskType.FILE),
  name: z.string().min(1),
  action: z.enum(["copy", "move", "delete"]),
  source: z.string().min(1),
  destination: z.string().optional(),
});

const NotifyTaskSchema = z.object({
  type: z.literal(TaskType.NOTIFY),
  name: z.string().min(1),
  message: z.string().min(1),
  level: z.enum(["info", "warn", "error"]),
});

const TaskSchema = z.discriminatedUnion("type", [
  ShellTaskSchema,
  HttpTaskSchema,
  FileTaskSchema,
  NotifyTaskSchema,
]);

const PipelineSchema = z.object({
  name: z.string().min(1, "Pipeline precisa ter um nome"),
  description: z.string().optional(),
  parallel: z.boolean().optional().default(false),
  tasks: z.array(TaskSchema).min(1, "Pipeline precisa ter ao menos uma tarefa"),
});

export function parsePipeline(filePath: string): Pipeline {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo não encontrado: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = yaml.load(raw);

  const result = PipelineSchema.safeParse(parsed);

  if (!result.success) {
    const messages = result.error.issues
      .map((issue) => `  • ${issue.path.join(".")} — ${issue.message}`)
      .join("\n");
    throw new Error(`Erro de validação no pipeline:\n${messages}`);
  }

  return result.data as Pipeline;
}
