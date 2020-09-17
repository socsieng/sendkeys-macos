const { execFileSync } = require('child_process');
const generator = require('./generator');

const defaultOptions = {
  delay: 0,
  initialDelay: 0,
  generateScript: false,
};

function sendKeys(appName, keystrokes, options = {}) {
  const mergedOptions = {
    ...defaultOptions,
    ...(options || {}),
  };
  const output = generator.generate(keystrokes, appName, mergedOptions.delay, mergedOptions.initialDelay);

  if (mergedOptions.generateScript) {
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

module.exports = sendKeys;
