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
// In src/extension.ts
const vscode = __importStar(require("vscode"));
const historyDataProvider_1 = require("./historyDataProvider");
// This method is called when your extension is activated
function activate(context) {
    // 1. Create and register our History Data Provider
    const historyProvider = new historyDataProvider_1.HistoryDataProvider();
    vscode.window.registerTreeDataProvider('terminal-history-view', historyProvider);
    // 2. Register our "Copy" command
    let copyCommand = vscode.commands.registerCommand('terminalHistory.copyOutput', (item) => {
        if (item && item.fullOutput) {
            vscode.env.clipboard.writeText(item.fullOutput);
            vscode.window.showInformationMessage('Terminal output copied!');
        }
        else {
            vscode.window.showErrorMessage('Could not copy item.');
        }
    });
    // 3. Listen for completed terminal commands
    console.log("TerminalHistory: Attaching terminal listener...");
    let terminalCommandListener = vscode.window.onDidEndTerminalShellExecution(async (e) => {
        console.log("TerminalHistory: Event Fired!");
        if (e.exitCode === undefined) {
            return;
        }
        const execution = e.execution;
        // This helper function is now correct
        async function getFullCommandOutput(shellExecution) {
            return new Promise(async (resolve) => {
                let output = '';
                const stream = await shellExecution.read();
                try {
                    for await (const chunk of stream) {
                        output += chunk;
                    }
                    resolve(output);
                }
                catch (error) {
                    console.error('Error reading from terminal stream:', error);
                    resolve("Error reading output.");
                }
            });
        }
        // *** THE FIX IS HERE ***
        // 'execution.commandLine' is an object. We call .toString()
        // to get the actual command string.
        const commandLine = execution.commandLine.toString();
        const output = await getFullCommandOutput(execution);
        // This will now work, since commandLine is a string
        historyProvider.addEntry({
            command: commandLine,
            output: output.trim(),
            timestamp: new Date()
        });
    });
    // Add all our commands and listeners to the extension's subscriptions
    context.subscriptions.push(copyCommand, terminalCommandListener);
    vscode.window.showInformationMessage('TerminalHistory extension is now active!');
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map