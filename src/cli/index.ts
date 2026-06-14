#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import path from "path";
import { logger } from "../logger";
import { parsePipeline } from "../parser";
import { runPipeline } from "../runner";

const program = new Command();

program
  .name("taskflow")
  .description("Orquestrador de automações local")
  .version("1.0.0");

program
  .command("run <file>")
  .description("Executa um pipeline definido em YAML")
  .option("-o, --output <path>", "Salva o relatório em um arquivo JSON")
  .action(async (file: string, options: { output?: string }) => {
    try {
      const filePath = path.resolve(file);
      const pipeline = parsePipeline(filePath);
      const report = await runPipeline(pipeline);

      if (options.output) {
        const outputPath = path.resolve(options.output);
        fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), "utf-8");
        logger.info(`Relatório salvo em: ${outputPath}`);
      }

      process.exit(report.success ? 0 : 1);
    } catch (err) {
      const error = err as Error;
      logger.error(error.message);
      process.exit(1);
    }
  });

program
  .command("validate <file>")
  .description("Valida a sintaxe de um pipeline sem executá-lo")
  .action((file: string) => {
    try {
      const filePath = path.resolve(file);
      parsePipeline(filePath);
      logger.success("Pipeline válido!");
    } catch (err) {
      const error = err as Error;
      logger.error(error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
