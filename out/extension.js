"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const historyDataProvider_1 = require("./historyDataProvider");
function activate(context) {
    console.log('TerminalHistory extension is activating...');
    // Create and register the History Data Provider
    const historyProvider = new historyDataProvider_1.HistoryDataProvider();
    vscode.window.registerTreeDataProvider('terminal-history-view', historyProvider);
    // Register the Copy command
    const copyCommand = vscode.commands.registerCommand('terminalHistory.copyOutput', (item) => {
        if (item && item.fullOutput) {
            vscode.env.clipboard.writeText(item.fullOutput);
            vscode.window.showInformationMessage(`Copied output from: ${item.commandText}`);
        }
        else {
            vscode.window.showErrorMessage('Could not copy output.');
        }
    });
    // Register the Clear History command
    const clearCommand = vscode.commands.registerCommand('terminalHistory.clearHistory', () => {
        historyProvider.clearHistory();
        vscode.window.showInformationMessage('Terminal history cleared!');
    });
    // Register the Capture Terminal Output command
    const captureTerminalCommand = vscode.commands.registerCommand('terminalHistory.captureTerminal', () => {
        const activeTerminal = vscode.window.activeTerminal;
        if (!activeTerminal) {
            vscode.window.showWarningMessage('No active terminal found. Please open a terminal first.');
            return;
        }
        vscode.window.showInformationMessage('Note: This captures visible terminal content. For full command history, commands are auto-captured when they complete.', 'OK');
        // Get terminal selection or visible content
        // Note: VS Code API doesn't provide direct access to terminal buffer
        // So we inform users about the limitation
        const timestamp = new Date();
        const terminalName = activeTerminal.name;
        historyProvider.addEntry({
            command: `📟 Manual Terminal Capture - ${terminalName}`,
            output: `Terminal: ${terminalName}\nTime: ${timestamp.toLocaleString()}\n\n` +
                `Note: To capture full terminal output:\n` +
                `1. Select the text in the terminal\n` +
                `2. Copy it (Ctrl+C / Cmd+C)\n` +
                `3. The content is now in your clipboard\n\n` +
                `Alternatively, use the auto-capture feature by running commands normally.\n` +
                `Each command's output is automatically saved to this history.`,
            exitCode: undefined,
            timestamp: timestamp
        });
    });
    // Register the Capture Problems command
    const captureProblemsCommand = vscode.commands.registerCommand('terminalHistory.captureProblems', () => {
        const diagnostics = vscode.languages.getDiagnostics();
        if (diagnostics.length === 0) {
            vscode.window.showInformationMessage('No problems found!');
            return;
        }
        let problemsText = '=== PROBLEMS ===\n\n';
        let totalProblems = 0;
        diagnostics.forEach(([uri, fileDiagnostics]) => {
            if (fileDiagnostics.length > 0) {
                const relativePath = vscode.workspace.asRelativePath(uri);
                problemsText += `📄 ${relativePath}\n`;
                fileDiagnostics.forEach(diagnostic => {
                    totalProblems++;
                    const severity = diagnostic.severity === vscode.DiagnosticSeverity.Error ? '❌ ERROR' :
                        diagnostic.severity === vscode.DiagnosticSeverity.Warning ? '⚠️  WARNING' :
                            diagnostic.severity === vscode.DiagnosticSeverity.Information ? 'ℹ️  INFO' : '💡 HINT';
                    const line = diagnostic.range.start.line + 1;
                    const col = diagnostic.range.start.character + 1;
                    problemsText += `  ${severity} [Ln ${line}, Col ${col}]\n`;
                    problemsText += `  ${diagnostic.message}\n`;
                    if (diagnostic.source) {
                        problemsText += `  Source: ${diagnostic.source}\n`;
                    }
                    problemsText += '\n';
                });
                problemsText += '\n';
            }
        });
        // Add to history
        historyProvider.addEntry({
            command: `📋 Captured Problems (${totalProblems} total)`,
            output: problemsText,
            exitCode: totalProblems > 0 ? 1 : 0,
            timestamp: new Date()
        });
        vscode.window.showInformationMessage(`Captured ${totalProblems} problems to history!`);
    });
    // Listen for terminal command execution
    console.log('TerminalHistory: Setting up terminal listener...');
    const terminalCommandListener = vscode.window.onDidEndTerminalShellExecution(async (e) => {
        try {
            console.log('TerminalHistory: Command execution ended');
            const execution = e.execution;
            // Get the command that was executed
            let commandText = '';
            if (execution.commandLine) {
                if (typeof execution.commandLine === 'string') {
                    commandText = execution.commandLine;
                }
                else if (execution.commandLine.value) {
                    commandText = execution.commandLine.value;
                }
                else {
                    commandText = String(execution.commandLine);
                }
            }
            if (!commandText) {
                console.log('TerminalHistory: No command text found');
                return;
            }
            console.log('TerminalHistory: Command:', commandText);
            // Read the output
            let output = '';
            try {
                const stream = execution.read();
                for await (const data of stream) {
                    output += data;
                }
                console.log('TerminalHistory: Output captured, length:', output.length);
            }
            catch (readError) {
                console.error('TerminalHistory: Error reading output:', readError);
                output = '[Error reading terminal output]';
            }
            // Add to history
            historyProvider.addEntry({
                command: commandText.trim(),
                output: output.trim() || '[No output]',
                exitCode: e.exitCode,
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('TerminalHistory: Error in terminal listener:', error);
        }
    });
    // Listen for diagnostic changes (problems)
    const diagnosticListener = vscode.languages.onDidChangeDiagnostics((e) => {
        // Optional: Auto-capture problems when they change
        // Uncomment if you want automatic capture
        // console.log('TerminalHistory: Diagnostics changed for', e.uris.length, 'files');
    });
    // Add all disposables to subscriptions
    context.subscriptions.push(copyCommand, clearCommand, captureProblemsCommand, captureTerminalCommand, terminalCommandListener, diagnosticListener);
    vscode.window.showInformationMessage('Terminal History extension is now active!');
    console.log('TerminalHistory: Extension activated successfully');
}
function deactivate() {
    console.log('TerminalHistory: Extension deactivated');
}
//# sourceMappingURL=extension.js.map