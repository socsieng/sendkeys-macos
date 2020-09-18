/**
 * Types text input with a default delay between each character.
 *
 * @param {string} text
 * @param {number} defaultDelay
 * @param {*} options
 */
function type(text, defaultDelay, { delay, sysevents }) {
  const KEYS = {
    f1: 122,
    f2: 120,
    f3: 99,
    f4: 118,
    f5: 96,
    f6: 97,
    f7: 98,
    f8: 100,
    f9: 101,
    f10: 109,
    f11: 103,
    f12: 111,
    esc: 53,
    return: 36,
    enter: 76,
    delete: 51,
    space: 49,
    tab: 48,
    up: 126,
    down: 125,
    left: 123,
    right: 124,
    home: 115,
    end: 119,
    pgup: 116,
    pgdown: 121,
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
    'cmd': 'command down',
    'ctrl': 'control down',
    'alt': 'option down',
  };

  // matches <p:0.1>
  const pauseExpression = /^\<(p):([\d.]+)\>/i;
  // matches <c:down>, <c:up:command>
  const charExpression = /^\<c:(.|[\w]+)(:([,\w⌘^⌥⇧]+))?\>/;
  // matches <\>
  const continuationExpression = /^\<\\\>/;

  let index = 0;

  function ensurePause(pause) {
    const pauseMatch = pauseExpression.exec(text.substring(index));
    if (pauseMatch) {
      const value = parseFloat(pauseMatch[2]);
      delay(value);
      index += pauseMatch[0].length;

      // update default delay
      if (pauseMatch[1] === 'P') {
        defaultDelay = value;
      }

      return true;
    }
    if (pause) {
      delay(pause);
    }
    return false;
  }

  do {
    const continuationMatch = continuationExpression.exec(text.substring(index));

    if (continuationMatch) {
      index += continuationMatch[0].length + 1;
      continue;
    }

    const charMatch = charExpression.exec(text.substring(index));

    if (charMatch) {
      const value = charMatch[1];
      const modifiers = (charMatch[3] || '')
        .split(',')
        .filter(m => m)
        .map(m => MODIFIERS[m]);

      if (value in KEYS) {
        sysevents.keyCode(KEYS[value], { using: modifiers });
      } else {
        sysevents.keystroke(value[0], { using: modifiers });
      }
      index += charMatch[0].length;
      ensurePause(defaultDelay);
      continue;
    }

    const char = text[index];

    if (char) {
      if (ensurePause()) continue;

      sysevents.keystroke(char);
      index++;

      ensurePause(defaultDelay);
    }
  } while (text[index]);
}

module.exports = type;
