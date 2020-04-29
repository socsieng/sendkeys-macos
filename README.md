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

Basic markup is supported to control the pause between keystrokes and to apply additional keystroke combinations.

#### Inserting a pause

A pause can be inserted with the `<p:number>` sequence.

By default, the delay between keystrokes is set with the `-d` or `--delay` option where the default is 0.1 second. A one-off pause of 1 second can be applied between characters by inserting `<p:1>`.

#### Special key combinations

Special key combinations including non-printable character sequences can be applied using the `<c:key>` or `<c:key:modifiers>` markup.

`key` can include any printable character or, one of the following key names: `f1`, `f2`, `f3`, `f4`, `f5`, `f6`, `f7`, `f8`, `f9`, `f10`, `f11`, `f12`, `esc`, `return`, `enter`, `delete`, `space`, `tab`, `up`, `down`, `left`, and `right`.

`modifiers` is an optional list of comma separated values that can include `command`, `shift`, `control`, and `option`.

Example key combinations:

- `tab`: `<c:tab>`
- `command` + `a`: `<c:a:command>`
- `option` + `shift` + `left arrow`: `<c:left:option,shift>`

## Prerequisites

This script only works on macOS as it has a dependency on the macOS Automator application.

When running from the terminal, ensure that the terminal has permissions to send keystrokes. This can be done by navigating to System Preferences > Security & Privacy > Privacy > Accessibility and adding your terminal application there.
