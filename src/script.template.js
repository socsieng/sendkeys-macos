const app = Application(/** application-name **/);
const sysevents = Application('System Events');

const KEYS = {
  'f1': 122,
  'f2': 120,
  'f3': 99,
  'f4': 118,
  'f5': 96,
  'f6': 97,
  'f7': 98,
  'f8': 100,
  'f9': 101,
  'f10': 109,
  'f11': 103,
  'f12': 111,
  'esc': 53,
  'return': 36,
  'enter': 76,
  'delete': 51,
  'space': 49,
  'tab': 48,
  'up': 126,
  'down': 125,
  'left': 123,
  'right': 124,
  'home': 115,
  'end': 119,
  'pgup': 116,
  'pgdown': 121,
};
const MODIFIERS = {
  '⌘': 'command down',
  '^': 'control down',
  '⌥': 'option down',
  '⇧': 'shift down',
  'command': 'command down',
  'control': 'control down',
  'option': 'option down',
  'shift': 'shift down',
};

// matches <p:0.1>
const pauseExpression = /^\<p:([\d.]+)\>/i;
// matches <c:down>, <c:up:command>
const charExpression = /^\<c:(.|[\w]+)(:([,\w⌘^⌥⇧]+))?\>/i;
// matches <\>
const continuationExpression = /^\<\\\>/;

/** type-function **/

function run(input, parameters) {
  app.activate();

  delay(/** initial-delay **/);

/** type-commands **/

  return input;
}
