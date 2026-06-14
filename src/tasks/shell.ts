import { exec } from "child_process";
import { promisify } from "util";
import { ShellTask, TaskResult, TaskStatus } from "../types";

const execAsync = promisify(exec);

export async function runShellTask(task: ShellTask): Promise<TaskResult> {
  const start = Date.now();

  try {
    const { stdout, stderr } = await execAsync(task.command, {
      cwd: task.workingDir ?? process.cwd(),
    });

    return {
      taskName: task.name,
      status: TaskStatus.SUCCESS,
      output: stdout || stderr,
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
