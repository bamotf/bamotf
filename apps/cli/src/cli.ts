#!/usr/bin/env node

import { cac } from "cac";
import { intro } from "@clack/prompts";
import color from "picocolors";
import { receive } from "./receive";

const cli = cac();

/**
 * Execute commands based on the arguments passed
 */

async function main() {
  console.log();
  intro(color.inverse(" cashier "));

  cli
    .command("", "Receive")
    .option("-a, --amount <amount>", "Amount to receive")
    .action(receive);

  // Display help message when `-h` or `--help` appears
  cli.help();
  cli.parse();
}

main().catch(console.error);
