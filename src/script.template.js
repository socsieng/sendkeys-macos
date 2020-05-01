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
  'enter': 52,
  'delete': 51,
  'space': 49,
  'tab': 48,
  'up': 126,
  'down': 125,
  'left': 123,
  'right': 124,
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

/**
 * Types text input with a default delay between each character.
 *
 * @param {string} text
 * @param {number} defaultDelay
 */
function type(text, defaultDelay) {
  let index = 0;

  function ensurePause(pause) {
    const pauseMatch = pauseExpression.exec(text.substring(index));
    if (pauseMatch) {
      const value = parseFloat(pauseMatch[1]);
      delay(value);
      index += pauseMatch[0].length;
      return true;
    }
    if (pause) {
      delay(pause);
    }
    return false;
  }

  do {
    const charMatch = charExpression.exec(text.substring(index));

    if (charMatch) {
      const value = charMatch[1];
      const modifiers = (charMatch[3] || '').split(',').filter(m => m).map(m => MODIFIERS[m]);

      if (value in KEYS) {
        sysevents.keyCode(KEYS[value], { using: modifiers });
      } else {
        sysevents.keystroke(value[0], { using: modifiers });
      }
      index += charMatch[0].length;
      ensurePause(defaultDelay);
      continue;
    }

    if (ensurePause()) continue;

    sysevents.keystroke(text[index]);
    index++;

    ensurePause(defaultDelay);
  } while (text[index]);
}


function run(input, parameters) {
  app.activate();

  delay(/** initial-delay **/);

/** type-commands **/

  return input;
}
