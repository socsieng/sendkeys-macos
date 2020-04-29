# SendKeys for macOS

This is a CLI tool to send keys to a given app to simulate typing at a given speed.

This tool was originally created to make it easier to enter keystrokes for a smooth screen recording of code being typed in.

# Installation

```sh
npm install sendkeys-macos --global
```

## Usage

Basic usage:

```sh
sendkeys -a "Notes" -c "Hello<p:1> world<c:left:option,shift><c:i:command>"
```

Providing input from a file:

```sh
sendkeys -a "Visual Studio Code" -f example.txt
```

Receiving input from `stdio`:

```sh
cat example.txt | sendkeys -a "Notes"
```

Refer to the help command for more options:

```sh
sendkeys --help
```

### Markup instructions

The tool allows you to specify a default interval for keystrokes to be sent (using the `-d` or `--delay` option where the default is 0.1s), pauses can be inserted into by adding `<p:number>` where `number` is the number of seconds to pause before continuing with the next character.

Special key combinations are also supported like arrow keys, as well as key modifiers `command`, `shift`, `control`, and `option`. This can be achieved by using the markup syntax `<c:key:modifiers>`.

## Prerequisites

This script only works on macOS as it has a dependency on the macOS Automator application.

When running from the terminal, ensure that the terminal has permissions to send keystrokes. This can be done by navigating to System Preferences > Security & Privacy > Privacy > Accessibility and adding your terminal application there.
