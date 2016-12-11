import { DocumentSymbolProvider, TextDocument, CancellationToken, SymbolInformation, SymbolKind, Range, Position } from 'vscode';
import documentCache from './documentCache';

export class CFSymbolProvider implements DocumentSymbolProvider {
    public provideDocumentSymbols(document: TextDocument, token: CancellationToken): SymbolInformation[] | Thenable<SymbolInformation[]> {
        return new Promise((resolve, reject) => {
            resolve(buildSymbolInformation(document));
        });
    }
}

export function buildSymbolInformation(document: TextDocument): SymbolInformation[] {
    let symbols = [];

    for (let key in documentCache.getJson().Parameters) {
        let item = new SymbolInformation(key, SymbolKind.Property, getSymbolLocation(document, key), document.uri)
        let parameter = documentCache.getJson().Parameters[key]
        symbols.push(item);
    }

    for (let key in documentCache.getJson().Resources) {
        let item = new SymbolInformation(key, SymbolKind.Function, getSymbolLocation(document, key), document.uri)
        symbols.push(item);
    }

    return symbols;
}

export function getSymbolLocation(document: TextDocument, symbol: String): Range {
    let r = RegExp('("' + symbol + '"\\s?:)');
    let match
    for (let i = 0; i < document.lineCount; i++) {
        while ((match = r.exec(document.lineAt(i).text)) != null) {
            return new Range(new Position(i, match.index), new Position(i, match.index + match[0].length));
        }
    }
}