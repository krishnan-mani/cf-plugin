import { TextDocument, CompletionItem, Position, CompletionItemProvider, CompletionItemKind, CancellationToken } from 'vscode';
import documentCache from './documentCache';

export class CFCompletionItemProvider implements CompletionItemProvider {
    public provideCompletionItems(
        document: TextDocument, position: Position, token: CancellationToken):
        Thenable<CompletionItem[]> {
        return new Promise<CompletionItem[]>((resolve, reject) => {
            let refs = [];

            if (document.lineAt(position.line).text.indexOf("Ref") < 0) {
                resolve(refs);
                return;
            }

            for (let key in documentCache.getJson().Parameters) {
                let item = new CompletionItem(key, CompletionItemKind.Field)
                let parameter = documentCache.getJson().Parameters[key]
                item.insertText = '"' + key + '"';
                item.documentation = parameter.Description || "";
                if (parameter.Default)
                    item.documentation += " (Default value: " + parameter.Default + ")";
                refs.push(item);
            }

            for (let key in documentCache.getJson().Resources) {
                let item = new CompletionItem(key, CompletionItemKind.Function)
                item.insertText = '"' + key + '"';
                refs.push(item);
            }

            resolve(refs);
        });
    }
}
