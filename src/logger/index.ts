import chalk from "chalk";

const prefix = {
  info: chalk.blue("[INFO]"),
  success: chalk.green("[OK]  "),
  warn: chalk.yellow("[WARN]"),
  error: chalk.red("[ERR] "),
  task: chalk.magenta("[TASK]"),
} as const;

export const logger = {
  info: (msg: string) => console.log(`${prefix.info}  ${msg}`),
  success: (msg: string) =>
    console.log(`${prefix.success} ${chalk.green(msg)}`),
  warn: (msg: string) => console.warn(`${prefix.warn} ${chalk.yellow(msg)}`),
  error: (msg: string) => console.error(`${prefix.error} ${chalk.red(msg)}`),
  task: (msg: string) => console.log(`${prefix.task} ${chalk.magenta(msg)}`),

  divider: () => console.log(chalk.gray("─".repeat(50))),

  header: (title: string) => {
    console.log("");
    console.log(chalk.bold.cyan("  TaskFlow CLI"));
    console.log(chalk.gray(`  Pipeline: ${title}`));
    console.log("");
  },
};
