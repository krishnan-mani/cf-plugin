'use strict';

import * as vscode from 'vscode';
import * as URL from 'url';
import { CancellationToken } from 'vscode';
import { CFCompletionItemProvider } from './completionItemProvider';
import { CFRenameProvider } from './renameProvider';
import { CFSymbolProvider } from './symbolProvider';
import documentCache from './documentCache';

const CF_JSON_MODE: vscode.DocumentFilter = { language: 'json', scheme: 'file', pattern: '**/*.cf.json' };

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            CF_JSON_MODE, new CFCompletionItemProvider(), ':', '\"')
    );

    context.subscriptions.push(
        vscode.languages.registerRenameProvider(CF_JSON_MODE, new CFRenameProvider())
    );

    context.subscriptions.push(
        vscode.languages.registerDocumentSymbolProvider(CF_JSON_MODE, new CFSymbolProvider())
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(documentCache.onTextChange)
    );
}

let workspaceContext = {
    resolveRelativePath: (relativePath: string, resource: string) => {
        return URL.resolve(resource, relativePath);
    }
};

export function deactivate() {
}