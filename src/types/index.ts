export enum TaskStatus {
  PENDING = "pending",
  RUNNING = "running",
  SUCCESS = "success",
  FAILED = "failed",
  SKIPPED = "skipped",
}

export enum TaskType {
  SHELL = "shell",
  HTTP = "http",
  FILE = "file",
  NOTIFY = "notify",
}

export interface ShellTask {
  type: TaskType.SHELL;
  name: string;
  command: string;
  workingDir?: string;
}

export interface HttpTask {
  type: TaskType.HTTP;
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export interface FileTask {
  type: TaskType.FILE;
  name: string;
  action: "copy" | "move" | "delete";
  source: string;
  destination?: string;
}

export interface NotifyTask {
  type: TaskType.NOTIFY;
  name: string;
  message: string;
  level: "info" | "warn" | "error";
}

export type Task = ShellTask | HttpTask | FileTask | NotifyTask;

export interface TaskResult {
  taskName: string;
  status: TaskStatus;
  output?: string;
  error?: string;
  durationMs: number;
}

export interface Pipeline {
  name: string;
  description?: string;
  parallel?: boolean;
  tasks: Task[];
}

export interface RunReport {
  pipelineName: string;
  startedAt: string;
  finishedAt: string;
  totalDurationMs: number;
  results: TaskResult[];
  success: boolean;
}
