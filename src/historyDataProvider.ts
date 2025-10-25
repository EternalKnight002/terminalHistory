import * as vscode from 'vscode';

// Define the structure for a history item
type HistoryItemData = {
    command: string;
    output: string;
    timestamp: Date;
};

// The class that provides data to the TreeView
export class HistoryDataProvider implements vscode.TreeDataProvider<HistoryTreeItem> {
    
    // An event emitter to tell VS Code when our data changes
    private _onDidChangeTreeData: vscode.EventEmitter<HistoryTreeItem | undefined | null | void> = new vscode.EventEmitter<HistoryTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<HistoryTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    // Our internal data store
    private history: HistoryItemData[] = [];

    constructor() {
       }

    // A public method to add new entries and refresh the view
    public addEntry(item: HistoryItemData): void {
        this.history.unshift(item); // Add new items to the top
        this._onDidChangeTreeData.fire(); // Tell VS Code to refresh
    }
    
    // Required method: returns the visual representation (TreeItem) of an element
    getTreeItem(element: HistoryTreeItem): vscode.TreeItem {
        return element;
    }

    // Required method: returns the children of an element or root
    getChildren(element?: HistoryTreeItem): Thenable<HistoryTreeItem[]> {
        if (element) {
            // Our items don't have children (they are not expandable yet)
            return Promise.resolve([]);
        } else {
            // This is the root level, return all our history items
            const treeItems = this.history.map(item => 
                new HistoryTreeItem(item.command, item.output, vscode.TreeItemCollapsibleState.None)
            );
            return Promise.resolve(treeItems);
        }
    }
}

// Our custom TreeItem that holds the full output data
export class HistoryTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string, // The command will be the label
        public readonly fullOutput: string, // The full output, for copying
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `Command: ${this.label}`;
        // Show the first line of the output as the description
        this.description = this.fullOutput.split('\n')[0]; 
    }
}