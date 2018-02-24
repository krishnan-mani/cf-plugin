import { TextDocument, WorkspaceEdit, RenameProvider, Position, Range, CancellationToken } from 'vscode';

export class CFRenameProvider implements RenameProvider {
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
                    let rng = new Range(new Position(i, match.index), new Position(i, match.index + match[0].length));
                    edits.replace(document.uri, rng, ": " + newName);
                }
            }
            edits.replace(document.uri, range, newName);
            resolve(edits);
        });
    }
}