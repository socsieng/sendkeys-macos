const appName = "/** application-name **/";
const app = appName ? Application(appName) : null;
const sysevents = Application('System Events');

/** type-function **/

function run(input, parameters) {
  if (app) {
    app.activate();
  }

  delay(/** initial-delay **/);

  /** type-commands **/

  return input;
}
