const { execFileSync } = require('child_process');
const generator = require('./generator');
const { splitIncluding } = require('./splitter');
const path = require('path');
const { existsSync } = require('fs');

const defaultOptions = {
  delay: 0,
  initialDelay: 0,
  generateScript: false,
};

// matches <m:1,2,3,4:0.5> or <m:1,2,3,4>
const mouseMoveExpression = /\<m:((\d+),(\d+),)?(\d+),(\d+)(:([\d.]+))?\>/;
// matches <m:left:1> or <m:right>
const mouseClickExpression = /\<m:([a-z]+)(:(\d+))?\>/;
// matches <d:1,2,3,4:0.5:left> or <d:1,2:0.5:left> or <d:1,2,3,4:0.5>
const mouseDragExpression = /\<d:((\d+),(\d+),)?(\d+),(\d+)(:([\d.]+))?(:([a-z]+))?\>/;

const mouseExpressions = [mouseMoveExpression, mouseClickExpression, mouseDragExpression];

function sendKeys(appName, /** @type {string} */ keystrokes, options = {}) {
  const mergedOptions = {
    ...defaultOptions,
    ...(options || {}),
  };

  if (mergedOptions.generateScript) {
    const output = generator.generate(keystrokes, appName, mergedOptions.delay, mergedOptions.initialDelay);
    process.stdout.write(output);
    return;
  }

  const usingMouse = hasMouseCommands(keystrokes);
  const hasMouse = existsSync(path.resolve(__dirname, '../build/mouse'));

  if (usingMouse && hasMouse) {
    // mouse support
    const fragments = splitIncluding(
      keystrokes,
      mouseExpressions.map(exp => new RegExp(exp, 'g')),
    );
    let isFirstActivation = true;

    for (const fragment of fragments) {
      let result;
      let match;

      if ((match = mouseMoveExpression.exec(fragment))) {
        const [, , x1, y1, x2, y2, , duration] = match;
        result = sendMouseMove(x1, y1, x2, y2, duration);
      } else if ((match = mouseClickExpression.exec(fragment))) {
        const [, button, , count] = match;
        result = sendMouseClick(button, count);
      } else if ((match = mouseDragExpression.exec(fragment))) {
        const [, , x1, y1, x2, y2, , duration, , button] = match;
        result = sendMouseDrag(x1, y1, x2, y2, duration, button);
      } else {
        const output = generator.generate(
          fragment,
          isFirstActivation ? appName : undefined,
          mergedOptions.delay,
          isFirstActivation ? mergedOptions.initialDelay : 0,
        );
        result = execFileSync('osascript', ['-l', 'JavaScript', '-e', output], {
          encoding: 'utf8',
          stdio: 'pipe',
        });
        isFirstActivation = false;
      }

      if (result && result.trim()) {
        console.log(result);
      }
    }
  } else {
    if (usingMouse && !hasMouse) {
      console.warn(
        'Script appears to making use of mouse commands without supported binary. Mouse commands will appear as keystrokes.',
      );
    }

    const output = generator.generate(keystrokes, appName, mergedOptions.delay, mergedOptions.initialDelay);
    const result = execFileSync('osascript', ['-l', 'JavaScript', '-e', output], {
      encoding: 'utf8',
      stdio: 'pipe',
    });

    if (result && result.trim()) {
      console.log(result);
    }
  }
}

function hasMouseCommands(keystrokes) {
  return mouseExpressions.map(exp => new RegExp(exp, 'g')).some(exp => exp.test(keystrokes));
}

function sendMouseMove(x1, y1, x2, y2, duration) {
  return sendMouseCommands({ x1, y1, x2, y2, duration });
}

function sendMouseClick(button, count) {
  return sendMouseCommands({ click: button, clicks: count });
}

function sendMouseDrag(x1, y1, x2, y2, duration, button) {
  return sendMouseCommands({ x1, y1, x2, y2, duration, drag: button || 'left' });
}

function sendMouseCommands(options) {
  const args = [];
  const fixedOptions = {
    ...options,
    duration: options.duration ? Number(options.duration) * 1000 : undefined,
  };

  Object.keys(fixedOptions)
    .filter(key => fixedOptions[key] != null)
    .forEach(key => args.push(`-${key}`, `${fixedOptions[key]}`));

  return execFileSync(path.resolve(__dirname, '../build/mouse'), args, {
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

module.exports = sendKeys;
