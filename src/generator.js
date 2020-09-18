const fs = require('fs');
const path = require('path');
const type = require('./type');

const template = fs.readFileSync(path.join(__dirname, 'script.template.js'), 'utf8');

const REPLACE_APPLICATION_NAME = '/** application-name **/';
const REPLACE_INITIAL_DELAY = '/** initial-delay **/';
const REPLACE_TYPE_FUNCTION = '/** type-function **/';
const REPLACE_TYPE_COMMANDS = '/** type-commands **/';

const lineEndingExpression = /\r?\n/g;

function generate(text, app, delay, initialDelay) {
  const commands = `type(${JSON.stringify(text.replace(lineEndingExpression, '\r'))}, ${delay}, { delay, sysevents });`;

  return template
    .replace(REPLACE_APPLICATION_NAME, app || '')
    .replace(REPLACE_INITIAL_DELAY, initialDelay)
    .replace(REPLACE_TYPE_FUNCTION, type.toString())
    .replace(REPLACE_TYPE_COMMANDS, commands);
}

exports.generate = generate;
