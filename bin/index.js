import { Command } from 'commander';
import pageLoader from '../src/index';

const program = new Command();

program
  .name('page-loader')
  .version('1.0.0')
  .description('Page loader')
  .option('-o, --output [path]', 'output dir', '/home/Nordask')
  .argument('<url>')
  .action(() => {
    const option = program.opts();
    const file = pageLoader(url, option.output);
    console.log(option, file);
  });
program.parse();
