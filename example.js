const sendKeys = require('./src/index');

sendKeys('Notes', 'hello<c:a:command><c:c:command><c:right> <c:v:command>', { delay: 0.1, initialDelay: 1 });
