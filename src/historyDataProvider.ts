import * as vscode from 'vscode';

export type HistoryItemData = {
    command: string;
    output: string;
    exitCode?: number;
    timestamp: Date;
};

export class HistoryDataProvider implements vscode.TreeDataProvider<HistoryTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<HistoryTreeItem | undefined | null | void> = 
        new vscode.EventEmitter<HistoryTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<HistoryTreeItem | undefined | null | void> = 
        this._onDidChangeTreeData.event;

    private history: HistoryItemData[] = [];
    private maxHistoryItems = 100; // Limit history to prevent memory issues

    constructor() {
        console.log('HistoryDataProvider: Initialized');
    }

    public addEntry(item: HistoryItemData): void {
        console.log('HistoryDataProvider: Adding entry:', item.command.substring(0, 50));
        
        // Add to the beginning of the array (most recent first)
        this.history.unshift(item);
        
        // Limit history size
        if (this.history.length > this.maxHistoryItems) {
            this.history = this.history.slice(0, this.maxHistoryItems);
        }
        
        // Notify VS Code to refresh the view
        this._onDidChangeTreeData.fire();
    }

    public clearHistory(): void {
        this.history = [];
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: HistoryTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: HistoryTreeItem): Thenable<HistoryTreeItem[]> {
        if (element) {
            // No nested children
            return Promise.resolve([]);
        }

        if (this.history.length === 0) {
            // Return empty array if no history
            return Promise.resolve([]);
        }

        // Convert history items to tree items
        const treeItems = this.history.map((item, index) => {
            return new HistoryTreeItem(
                item.command,
                item.output,
                item.exitCode,
                item.timestamp,
                index
            );
        });

        return Promise.resolve(treeItems);
    }
}

export class HistoryTreeItem extends vscode.TreeItem {
    public readonly fullOutput: string;
    public readonly commandText: string;
    public readonly exitCode: number | undefined;
    public readonly timestamp: Date;
    public readonly index: number;

    constructor(
        command: string,
        output: string,
        exitCode: number | undefined,
        timestamp: Date,
        index: number
    ) {
        // Call parent constructor with label only
        super(command.length > 60 ? command.substring(0, 57) + '...' : command, vscode.TreeItemCollapsibleState.None);
        
        // Set properties
        this.commandText = command;
        this.fullOutput = output;
        this.exitCode = exitCode;
        this.timestamp = timestamp;
        this.index = index;
        
        // Show time and exit code in description
        const timeStr = timestamp.toLocaleTimeString();
        const exitCodeStr = exitCode !== undefined ? ` [${exitCode}]` : '';
        this.description = `${timeStr}${exitCodeStr}`;
        
        // Show first line of output in tooltip
        const firstLine = output.split('\n')[0];
        const tooltipMd = new vscode.MarkdownString();
        tooltipMd.appendCodeblock(command, 'bash');
        tooltipMd.appendMarkdown(`**Exit Code:** ${exitCode ?? 'N/A'}\n\n`);
        tooltipMd.appendMarkdown(`**Time:** ${timestamp.toLocaleString()}\n\n`);
        tooltipMd.appendMarkdown(`**Output (first line):**\n`);
        tooltipMd.appendCodeblock(firstLine || '[empty]', 'text');
        this.tooltip = tooltipMd;
        
        // Set icon based on exit code
        if (exitCode === 0) {
            this.iconPath = new vscode.ThemeIcon('pass', new vscode.ThemeColor('testing.iconPassed'));
        } else if (exitCode !== undefined && exitCode !== 0) {
            this.iconPath = new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
        } else {
            this.iconPath = new vscode.ThemeIcon('terminal');
        }
        
        // Set context value for menu contributions
        this.contextValue = 'historyItem';
    }
}