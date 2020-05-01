const fs = require('fs');
const { program } = require('commander');
const { execFileSync } = require('child_process');
const packageInfo = require('../package.json');
const generator = require('./generator');

program
  .version(packageInfo.version)
  .description('Generates a script that can be used on macOS Automer to send keystrokes to a given application.')
  .option('-a, --application-name <name>', 'Name of the application to send keys to.')
  .option('-d, --delay <seconds>', 'Default delay between keystrokes.', 0.1)
  .option('-i, --initial-delay <seconds>', 'Initial delay before sending keystrokes.', 1)
  .option('-f, --input-file <file>', 'File containing keystroke instructions.')
  .option('-c, --characters <string>', 'String of characters to send.')
  .option('-g, --generate-script', 'Generate script instead of executing the command.')
  .parse(process.argv);

if (!program.applicationName) {
  console.error('Missing option --application-name.');
  process.exit(1);
}

if (program.characters) {
  execute(program.characters);
} else if (!program.inputFile) {
  let input = '';
  if (!process.stdin.isTTY) {
    process.stdin.on('data', data => {
      input += data;
    });
    process.stdin.on('end', () => {
      execute(input);
    });
  } else {
    console.error('Missing option --input-file.');
    process.exit(1);
  }
} else {
  execute(fs.readFileSync(program.inputFile, 'utf8'));
}

function execute(input) {
  const output = generator.generate(input, program.applicationName, program.delay, program.initialDelay);

  if (program.generateScript) {
    process.stdout.write(output);
  } else {
    const result = execFileSync('osascript', ['-l', 'JavaScript', '-e', output], {
      encoding: 'utf8',
      stdio: 'pipe',
    });

    if (result && result.trim()) {
      console.log(result);
    }
  }
}
