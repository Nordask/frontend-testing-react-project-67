#!/usr/bin/env node
import { Command } from 'commander';
import pageLoader from '../src/index.js';

const program = new Command();

program
  .name('page-loader')
  .version('1.0.0')
  .description('Page loader')
  .option('-o, --output [path]', 'output dir', '/home/Nordask')
  .argument('<url>')
  .action((url, option) => {
    const file = pageLoader(url, option.output);
    console.log(option, file);
  });
program.parse(process.argv);
