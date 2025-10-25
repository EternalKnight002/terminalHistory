# Terminal History 📋

A simple VS Code extension that logs all your terminal command outputs to a dedicated sidebar view for easy copying.

Tired of scrolling endlessly through your terminal to find and copy a specific error message or command output? Terminal History solves this by creating a clean, structured log of every command you run, right in your sidebar.

---

## Features

* **Automatic Logging:** Automatically captures the command and its full output every time you run a command in the integrated terminal.
* **Clean Sidebar View:** Displays a scrollable list of your command history in a new "Terminal History" view in the Activity Bar.
* **One-Click Copy:** A convenient "Copy" icon appears on every entry. Click it to instantly copy the entire output to your clipboard, ready to be pasted into an AI, a search engine, or a document.

---

## How to Use

1.  Install the extension.
2.  Click the new **Terminal History icon** (a list icon) in your VS Code Activity Bar to open the view.
3.  Open an integrated terminal (`Ctrl + ~`).
4.  Run any command (e.g., `git status`, `npm run dev`).
5.  The command and its full output will automatically appear in the sidebar.
6.  Hover over an item and click the clipboard icon to copy its full output.

---

## Requirements

This extension relies on VS Code's **Shell Integration** to detect when commands finish and read their output.

If your commands are not appearing in the history, please ensure Shell Integration is **enabled** in your terminal. You can typically enable it from the terminal's "sparkle" icon (✨) or by running the `Terminal: Manage Shell Integration` command.

---

## Known Issues

No known issues at this time. If you find a bug, please open an issue on the [**GitHub repository**](https://github.com/EternalKnight002/terminalHistory/issues).

## Release Notes

See the [CHANGELOG.md](CHANGELOG.md) file for details on each release.