import ora from "ora";
import { logger } from "../logger";
import {
  runShellTask,
  runHttpTask,
  runFileTask,
  runNotifyTask,
} from "../tasks";
import {
  Pipeline,
  RunReport,
  Task,
  TaskResult,
  TaskStatus,
  TaskType,
} from "../types";

async function executeTask(task: Task): Promise<TaskResult> {
  switch (task.type) {
    case TaskType.SHELL:
      return runShellTask(task);
    case TaskType.HTTP:
      return runHttpTask(task);
    case TaskType.FILE:
      return runFileTask(task);
    case TaskType.NOTIFY:
      return runNotifyTask(task);
  }
}

export async function runPipeline(pipeline: Pipeline): Promise<RunReport> {
  logger.header(pipeline.name);
  if (pipeline.description) logger.info(pipeline.description);
  logger.divider();

  const startedAt = new Date().toISOString();
  const startTime = Date.now();
  let results: TaskResult[];

  if (pipeline.parallel) {
    logger.info("Modo: paralelo");
    const spinner = ora("Executando tarefas...").start();

    const settled = await Promise.allSettled(pipeline.tasks.map(executeTask));

    spinner.stop();

    results = settled.map((r, i) =>
      r.status === "fulfilled"
        ? r.value
        : {
            taskName: pipeline.tasks[i].name,
            status: TaskStatus.FAILED,
            error: r.reason?.message ?? "Erro desconhecido",
            durationMs: 0,
          },
    );
  } else {
    logger.info("Modo: sequencial");
    results = [];

    for (const task of pipeline.tasks) {
      const spinner = ora(`  ${task.name}`).start();
      const result = await executeTask(task);
      results.push(result);

      if (result.status === TaskStatus.SUCCESS) {
        spinner.succeed(`${task.name} (${result.durationMs}ms)`);
      } else {
        spinner.fail(`${task.name} — ${result.error}`);
      }
    }
  }

  logger.divider();

  const success = results.every((r) => r.status === TaskStatus.SUCCESS);
  const totalDurationMs = Date.now() - startTime;

  if (success) {
    logger.success(`Pipeline concluído em ${totalDurationMs}ms`);
  } else {
    const failed = results.filter((r) => r.status === TaskStatus.FAILED).length;
    logger.error(`${failed} tarefa(s) falharam. Total: ${totalDurationMs}ms`);
  }

  return {
    pipelineName: pipeline.name,
    startedAt,
    finishedAt: new Date().toISOString(),
    totalDurationMs,
    results,
    success,
  };
}
