'use strict';

import * as vscode from 'vscode';
import * as URL from 'url';
import { Position, CancellationToken, WorkspaceEdit, CompletionItem, TextDocument, RenameProvider, CompletionItemProvider, Range } from 'vscode';
import { JSONDocument, JSONSchema, LanguageSettings, getLanguageService } from 'vscode-json-languageService'

const CF_JSON_MODE: vscode.DocumentFilter = { language: 'json', scheme: 'file', pattern: '**/*.cf.json' };

export function activate(context: vscode.ExtensionContext) {

    // context.subscriptions.push(
    //     vscode.languages.registerCompletionItemProvider(
    //         CF_JSON_MODE, new CFCompletionItemProvider(), '.', '\"')
    // );
    context.subscriptions.push(
        vscode.languages.registerRenameProvider(CF_JSON_MODE, new CFRenameProvider())
    );
}

let workspaceContext = {
    resolveRelativePath: (relativePath: string, resource: string) => {
        return URL.resolve(resource, relativePath);
    }
};

function getJSONDocument(document: TextDocument): any {
    return JSON.parse(document.getText())
}

class CFRenameProvider implements RenameProvider {
    public provideRenameEdits(
        document: TextDocument, position: Position, newName: string, token: CancellationToken
    ): WorkspaceEdit | Thenable<WorkspaceEdit> {
        return new Promise<WorkspaceEdit>(
            (resolve, reject) => {
                var edits = new WorkspaceEdit();
                var range = document.getWordRangeAtPosition(position);
                var oldName = document.getText(range);
                var r = RegExp('\\:\\s?'+ oldName.replace(/"/g,'\\"'),"g");
                var match
                for (var i = 0; i < document.lineCount; i++) {
                    while ((match = r.exec(document.lineAt(i).text)) != null) {
                        var rng = new Range(new vscode.Position(i, match.index), new vscode.Position(i, match.index + match[0].length));
                        edits.replace(document.uri, rng, ": " + newName);
                    }
                }
                edits.replace(document.uri, range, newName);
                resolve(edits);
            }
        );
    }
}

class CFCompletionItemProvider implements CompletionItemProvider {
    public provideCompletionItems(
        document: TextDocument, position: Position, token: CancellationToken):
        Thenable<CompletionItem[]> {
        return undefined;
    }
}

export function deactivate() {
}