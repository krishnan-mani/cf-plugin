'use strict';

import * as vscode from 'vscode';
import * as URL from 'url';
import { Position, CancellationToken, WorkspaceEdit, CompletionItem, TextDocument, RenameProvider, CompletionItemProvider, Range } from 'vscode';
import { JSONDocument, JSONSchema, LanguageSettings, getLanguageService } from 'vscode-json-languageService'

const CF_JSON_MODE: vscode.DocumentFilter = { language: 'json', scheme: 'file', pattern: '**/*.cf.json' };
let jsonCache: any = {};

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            CF_JSON_MODE, new CFCompletionItemProvider(), ':', '\"')
    );

    context.subscriptions.push(
        vscode.languages.registerRenameProvider(CF_JSON_MODE, new CFRenameProvider())
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
            onTextChange(e);
        })
    );
}

let workspaceContext = {
    resolveRelativePath: (relativePath: string, resource: string) => {
        return URL.resolve(resource, relativePath);
    }
};

function getJSONDocument(document: TextDocument): any | Thenable<any> {
    return new Promise<any>((resolve, reject) => {
        let json = JSON.parse(document.getText())
        resolve(json);
    });
}

function onTextChange(e: vscode.TextDocumentChangeEvent) {
    getJSONDocument(e.document)
        .then(json => {
            jsonCache = json;
        }).catch(error => { });
}

class CFRenameProvider implements RenameProvider {
    public provideRenameEdits(
        document: TextDocument, position: Position, newName: string, token: CancellationToken
    ): WorkspaceEdit | Thenable<WorkspaceEdit> {
        return new Promise<WorkspaceEdit>((resolve, reject) => {
            let edits = new WorkspaceEdit();
            let range = document.getWordRangeAtPosition(position);
            let oldName = document.getText(range);
            let r = RegExp('\\:\\s?' + oldName.replace(/"/g, '\\"'), "g");
            let match
            for (let i = 0; i < document.lineCount; i++) {
                while ((match = r.exec(document.lineAt(i).text)) != null) {
                    let rng = new Range(new vscode.Position(i, match.index), new vscode.Position(i, match.index + match[0].length));
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
        return new Promise<CompletionItem[]>((resolve, reject) => {
            let refs = [];

            if (document.lineAt(position.line).text.indexOf("Ref") < 0) {
                resolve(refs);
                return;
            }

            for (let key in jsonCache.Parameters) {
                let item = new CompletionItem(key, vscode.CompletionItemKind.Field)
                let parameter = jsonCache.Parameters[key]
                item.insertText = '"' + key + '"';
                item.documentation = parameter.Description || "";
                if (parameter.Default)
                    item.documentation += " (Default value: " + parameter.Default + ")";
                refs.push(item);
            }

            for (let key in jsonCache.Resources) {
                let item = new CompletionItem(key, vscode.CompletionItemKind.Property)
                item.insertText = '"' + key + '"';
                refs.push(item);
            }

            resolve(refs);
        });
    }
}

export function deactivate() {
}