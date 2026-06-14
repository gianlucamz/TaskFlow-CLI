import fs from "fs/promises";
import path from "path";
import { FileTask, TaskResult, TaskStatus } from "../types";

export async function runFileTask(task: FileTask): Promise<TaskResult> {
  const start = Date.now();

  try {
    switch (task.action) {
      case "copy":
        if (!task.destination)
          throw new Error("'destination' é obrigatório para 'copy'");
        await fs.copyFile(task.source, task.destination);
        break;

      case "move":
        if (!task.destination)
          throw new Error("'destination' é obrigatório para 'move'");
        await fs.rename(task.source, task.destination);
        break;

      case "delete":
        await fs.unlink(task.source);
        break;
    }

    return {
      taskName: task.name,
      status: TaskStatus.SUCCESS,
      output: `Ação "${task.action}" concluída em ${path.resolve(task.source)}`,
      durationMs: Date.now() - start,
    };
  } catch (err) {
    const error = err as Error;
    return {
      taskName: task.name,
      status: TaskStatus.FAILED,
      error: error.message,
      durationMs: Date.now() - start,
    };
  }
}
