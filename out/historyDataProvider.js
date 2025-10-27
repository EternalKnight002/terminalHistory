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
exports.HistoryTreeItem = exports.HistoryDataProvider = void 0;
const vscode = __importStar(require("vscode"));
class HistoryDataProvider {
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    history = [];
    maxHistoryItems = 100; // Limit history to prevent memory issues
    constructor() {
        console.log('HistoryDataProvider: Initialized');
    }
    addEntry(item) {
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
    clearHistory() {
        this.history = [];
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
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
            return new HistoryTreeItem(item.command, item.output, item.exitCode, item.timestamp, index);
        });
        return Promise.resolve(treeItems);
    }
}
exports.HistoryDataProvider = HistoryDataProvider;
class HistoryTreeItem extends vscode.TreeItem {
    fullOutput;
    commandText;
    exitCode;
    timestamp;
    index;
    constructor(command, output, exitCode, timestamp, index) {
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
        }
        else if (exitCode !== undefined && exitCode !== 0) {
            this.iconPath = new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
        }
        else {
            this.iconPath = new vscode.ThemeIcon('terminal');
        }
        // Set context value for menu contributions
        this.contextValue = 'historyItem';
    }
}
exports.HistoryTreeItem = HistoryTreeItem;
//# sourceMappingURL=historyDataProvider.js.map