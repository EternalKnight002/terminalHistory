# Contributing to Terminal History

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Bugs 🐛

Found a bug? Please open an issue with:
- **Clear title** describing the bug
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **VS Code version** and OS
- **Shell type** (bash, zsh, PowerShell, etc.)
- **Screenshots** if applicable

### Suggesting Features 💡

Have an idea? Open an issue with:
- **Feature description** - what should it do?
- **Use case** - why is it useful?
- **Mockups/examples** if possible

### Pull Requests 🔧

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit** with clear messages: `git commit -m "Add: feature description"`
6. **Push**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

## Development Setup

### Prerequisites
- Node.js 18.x or higher
- VS Code 1.83.0 or higher
- Git

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/terminalHistory.git
cd terminalHistory

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes (during development)
npm run watch
```

### Running the Extension

1. Open the project in VS Code
2. Press `F5` to launch Extension Development Host
3. Test your changes in the new window
4. Check Debug Console for logs

### Project Structure

```
terminalHistory/
├── src/
│   ├── extension.ts           # Main extension logic
│   ├── historyDataProvider.ts # TreeView data provider
│   └── test/                  # Tests (if any)
├── resources/
│   └── history.svg            # Extension icon
├── out/                       # Compiled JavaScript (gitignored)
├── package.json               # Extension manifest
├── tsconfig.json              # TypeScript config
└── README.md                  # Documentation
```

## Code Style

### TypeScript Guidelines
- Use **TypeScript** for all new code
- Enable **strict mode** (already configured)
- Add **JSDoc comments** for public APIs
- Use **async/await** instead of callbacks
- Handle **errors gracefully** with try-catch

### Naming Conventions
- **camelCase** for variables and functions
- **PascalCase** for classes and types
- **UPPER_CASE** for constants
- Prefix private members with `_`

### Example
```typescript
export class HistoryDataProvider {
    private _history: HistoryItem[] = [];
    
    /**
     * Adds a new entry to the history
     * @param item The history item to add
     */
    public addEntry(item: HistoryItem): void {
        this._history.unshift(item);
        this._onDidChangeTreeData.fire();
    }
}
```

## Testing

### Manual Testing Checklist
Before submitting a PR, test:
- ✅ Terminal command capture works
- ✅ Problem capture works
- ✅ Copy to clipboard works
- ✅ Clear history works
- ✅ Icons display correctly
- ✅ Timestamps are accurate
- ✅ No console errors

### Test on Multiple Shells
- Bash
- Zsh
- PowerShell
- Fish (if available)

## Commit Messages

Use clear, descriptive commit messages:

```
Add: New feature description
Fix: Bug description
Update: Changes to existing feature
Docs: Documentation changes
Refactor: Code improvements without feature changes
Test: Adding or updating tests
```

Examples:
- `Add: Export history to JSON file`
- `Fix: Copy button not working on Windows`
- `Update: Improve error message formatting`
- `Docs: Add troubleshooting section to README`

## Pull Request Guidelines

### Before Submitting
1. ✅ Code compiles without errors: `npm run compile`
2. ✅ Lint passes: `npm run lint`
3. ✅ Extension loads without errors
4. ✅ Tested manually
5. ✅ Updated documentation if needed
6. ✅ Updated CHANGELOG.md

### PR Description Should Include
- **What** does this PR do?
- **Why** is this change needed?
- **How** did you implement it?
- **Screenshots** (for UI changes)
- **Related issues** (if any): Fixes #123

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
How did you test this?

## Screenshots (if applicable)

## Checklist
- [ ] Code compiles
- [ ] Tested manually
- [ ] Documentation updated
- [ ] CHANGELOG updated
```

## Code Review Process

1. Maintainer reviews your PR
2. Feedback may be provided
3. Make requested changes
4. Once approved, PR will be merged
5. Your contribution will be in the next release! 🎉

## Feature Requests We'd Love

Some ideas for contributions:
- 📁 Export history to file (JSON, Markdown, CSV)
- 🔍 Search/filter history entries
- 📌 Pin important entries
- ⌨️ Keyboard shortcuts
- 🎨 Syntax highlighting in output
- 📊 Statistics (commands run, success rate, etc.)
- 🏷️ Tags/categories for entries
- 🔄 Auto-refresh on diagnostics change
- 💾 Persistent storage (optional)
- 🎯 Quick actions (re-run command, etc.)

## Questions?

- 💬 Open a [Discussion](https://github.com/EternalKnight002/terminalHistory/discussions)
- 🐛 Report bugs in [Issues](https://github.com/EternalKnight002/terminalHistory/issues)
- 📧 Contact: [Create an issue for now]

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment.

### Expected Behavior
- Be respectful and constructive
- Accept feedback gracefully
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Publishing others' private information

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Terminal History! 🚀**