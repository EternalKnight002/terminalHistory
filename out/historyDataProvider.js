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
// The class that provides data to the TreeView
class HistoryDataProvider {
    // An event emitter to tell VS Code when our data changes
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    // Our internal data store
    history = [];
    constructor() {
    }
    // A public method to add new entries and refresh the view
    addEntry(item) {
        this.history.unshift(item); // Add new items to the top
        this._onDidChangeTreeData.fire(); // Tell VS Code to refresh
    }
    // Required method: returns the visual representation (TreeItem) of an element
    getTreeItem(element) {
        return element;
    }
    // Required method: returns the children of an element or root
    getChildren(element) {
        if (element) {
            // Our items don't have children (they are not expandable yet)
            return Promise.resolve([]);
        }
        else {
            // This is the root level, return all our history items
            const treeItems = this.history.map(item => new HistoryTreeItem(item.command, item.output, vscode.TreeItemCollapsibleState.None));
            return Promise.resolve(treeItems);
        }
    }
}
exports.HistoryDataProvider = HistoryDataProvider;
// Our custom TreeItem that holds the full output data
class HistoryTreeItem extends vscode.TreeItem {
    label;
    fullOutput;
    collapsibleState;
    constructor(label, // The command will be the label
    fullOutput, // The full output, for copying
    collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.fullOutput = fullOutput;
        this.collapsibleState = collapsibleState;
        this.tooltip = `Command: ${this.label}`;
        // Show the first line of the output as the description
        this.description = this.fullOutput.split('\n')[0];
    }
}
exports.HistoryTreeItem = HistoryTreeItem;
//# sourceMappingURL=historyDataProvider.js.map