import { TextDocument, TextDocumentChangeEvent } from 'vscode';

let jsonCache: any = {};

class DocumentCache {

    onTextChange(e: TextDocumentChangeEvent) {
        getJSONDocument(e.document)
            .then(json => {
                jsonCache = json;
            }).catch(error => { });
    }

    getJson() {
        return jsonCache;
    }

}

export default new DocumentCache();

export function getJSONDocument(document: TextDocument): any | Thenable<any> {
    return new Promise<any>((resolve, reject) => {
        let json = JSON.parse(document.getText())
        resolve(json);
    });
}