// In src/extension.ts
import * as vscode from 'vscode';
import { HistoryDataProvider, HistoryTreeItem } from './historyDataProvider';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

    // 1. Create and register our History Data Provider
    const historyProvider = new HistoryDataProvider();
    vscode.window.registerTreeDataProvider(
      'terminal-history-view',
      historyProvider
    );

    // 2. Register our "Copy" command
    let copyCommand = vscode.commands.registerCommand(
      'terminalHistory.copyOutput', 
      (item: HistoryTreeItem) => {
        if (item && item.fullOutput) {
            vscode.env.clipboard.writeText(item.fullOutput);
            vscode.window.showInformationMessage('Terminal output copied!');
        } else {
            vscode.window.showErrorMessage('Could not copy item.');
        }
    });
    
    // 3. Listen for completed terminal commands
	console.log("TerminalHistory: Attaching terminal listener...");
    let terminalCommandListener = vscode.window.onDidEndTerminalShellExecution(
        
        async (e: vscode.TerminalShellExecutionEndEvent) => {
			console.log("TerminalHistory: Event Fired!");
            if (e.exitCode === undefined) {
                return;
            }
            
            const execution = e.execution;

            // This helper function is now correct
            async function getFullCommandOutput(
                shellExecution: vscode.TerminalShellExecution
            ): Promise<string> {
                
                return new Promise<string>(async (resolve) => {
                    let output = '';
                    const stream = await shellExecution.read(); 
                    
                    try {
                        for await (const chunk of stream) {
                            output += chunk;
                        }
                        resolve(output);
                    } catch (error) {
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
        }
    );

    // Add all our commands and listeners to the extension's subscriptions
    context.subscriptions.push(copyCommand, terminalCommandListener);

    vscode.window.showInformationMessage('TerminalHistory extension is now active!');
}

// This method is called when your extension is deactivated
export function deactivate() {}