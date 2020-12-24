function splitIncluding(/** @type {string} */ input, /** @type {RegExp[]} */ expressions) {
  let result = [input];

  for (const expression of expressions) {
    const splitResults = result.map(item => splitAndIncludeExpression(item, expression));
    result = flatten(splitResults);
  }

  return result;
}

function splitAndIncludeExpression(/** @type {string} */ input, /** @type {RegExp} */ expression) {
  let match;
  const result = [];
  let index = 0;

  if (!expression.global) {
    throw new Error('Expression must be global');
  }

  while ((match = expression.exec(input))) {
    if (index !== match.index) {
      result.push(input.substring(index, match.index));
    }

    result.push(match[0]);
    index = match.index + match[0].length;
  }

  if (index < input.length) {
    result.push(input.substring(index));
  }

  return result;
}

function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

module.exports = {
  splitIncluding,
};
