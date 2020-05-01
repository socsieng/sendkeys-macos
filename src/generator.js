const fs = require('fs');
const path = require('path');

const template = fs.readFileSync(path.join(__dirname, 'script.template.js'), 'utf8');

const REPLACE_APPLICATION_NAME = '/** application-name **/';
const REPLACE_INITIAL_DELAY = '/** initial-delay **/';
const REPLACE_TYPE_COMMANDS = '/** type-commands **/';

const lineEndingExpression = /\r?\n/g;

function generate(text, app, delay, initialDelay) {
  const lines = text.split(lineEndingExpression);
  const commands = lines
    .map((line, index) => `  type(${JSON.stringify(line + (index === lines.length - 1 ? '' : '\r'))}, ${delay});`)
    .join(`\n`);

  return template
    .replace(REPLACE_APPLICATION_NAME, JSON.stringify(app))
    .replace(REPLACE_INITIAL_DELAY, initialDelay)
    .replace(REPLACE_TYPE_COMMANDS, commands);
}

exports.generate = generate;
