# Terminal History 📋

A VS Code extension that automatically captures and logs all your terminal command outputs for easy copying.

## ✨ Features

* **Automatic Capture**: Automatically logs every command and its full output from the integrated terminal
* **Visual Status**: See success (✓) or error (✗) icons based on exit codes
* **Quick Copy**: Click any history item to instantly copy its output to clipboard
* **Smart Display**: View command, timestamp, and exit code at a glance
* **Clear History**: Remove old entries with one click

## 🚀 Usage

1. Install the extension
2. Click the **Terminal History** icon in the Activity Bar (sidebar)
3. Open an integrated terminal (`Ctrl+~` or `Cmd+~`)
4. Run any command (e.g., `npm install`, `git status`, `python script.py`)
5. The command and output appear in the sidebar automatically
6. Click any item to copy its full output to clipboard

## ⚙️ Requirements

**CRITICAL**: This extension requires VS Code's **Shell Integration** feature to be enabled.

### Enabling Shell Integration

Shell Integration is usually enabled by default, but if commands aren't appearing:

1. Open VS Code settings (`Ctrl+,` or `Cmd+,`)
2. Search for "terminal.integrated.shellIntegration"
3. Ensure the following settings are enabled:
   - ✅ `Terminal > Integrated > Shell Integration: Enabled` (checked)
   - ✅ `Terminal > Integrated > Shell Integration: Show Welcome` (optional)

### Checking Shell Integration Status

In your terminal, you should see a small "sparkle" icon (✨) or arrow icon next to the command prompt. This indicates Shell Integration is active.

If you don't see it:
1. Close all terminals
2. Open a new terminal
3. Look for the icon or run: `Terminal: Manage Shell Integration` from Command Palette

### Supported Shells

- ✅ Bash
- ✅ Zsh
- ✅ PowerShell
- ✅ Fish
- ⚠️ Cmd (limited support)

## 🐛 Troubleshooting

### Commands not appearing in history

1. **Check Shell Integration**: Follow the steps above to enable it
2. **Restart VS Code**: After enabling Shell Integration
3. **Check the Output panel**: View > Output > Select "Terminal History" to see debug logs
4. **Try a simple command**: Run `echo "test"` to verify it's working

### "Error reading output" message

This can happen if:
- Shell Integration is not properly initialized
- The terminal was closed too quickly after the command
- The command output is binary data

### No output captured

Some commands that don't write to stdout (like `cd`) won't show output. This is normal.

## 📝 Tips

- **Long outputs**: The extension shows the first line as a preview. Click to copy the full output.
- **Exit codes**: Green checkmark (✓) = success (0), Red X (✗) = error (non-zero)
- **Clear history**: Click the clear icon in the Terminal History panel title
- **Keyboard shortcut**: You can add a custom keybinding for `terminalHistory.copyOutput`

## 🔧 Known Issues

- Commands that prompt for input (like `sudo`) may not capture output correctly
- Very large outputs (>10MB) may be truncated
- Binary output is not supported

## 📦 Development

To develop or modify this extension:

```bash
# Clone the repository
git clone <your-repo-url>
cd terminalhistory

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Press F5 in VS Code to launch Extension Development Host
```

## 📄 License

This project is open-source under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📮 Feedback

If you encounter any issues or have suggestions, please open an issue on GitHub.