import axios from "axios";
import { HttpTask, TaskResult, TaskStatus } from "../types";

export async function runHttpTask(task: HttpTask): Promise<TaskResult> {
  const start = Date.now();

  try {
    const response = await axios({
      method: task.method,
      url: task.url,
      data: task.body,
      headers: task.headers,
    });

    return {
      taskName: task.name,
      status: TaskStatus.SUCCESS,
      output: JSON.stringify(response.data, null, 2),
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
