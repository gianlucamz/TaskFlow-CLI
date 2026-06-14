import { logger } from "../logger";
import { NotifyTask, TaskResult, TaskStatus } from "../types";

export async function runNotifyTask(task: NotifyTask): Promise<TaskResult> {
  const start = Date.now();

  const logFn: Record<NotifyTask["level"], (msg: string) => void> = {
    info: logger.info,
    warn: logger.warn,
    error: logger.error,
  };

  logFn[task.level](task.message);

  return {
    taskName: task.name,
    status: TaskStatus.SUCCESS,
    output: task.message,
    durationMs: Date.now() - start,
  };
}
