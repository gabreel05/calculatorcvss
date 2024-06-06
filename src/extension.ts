import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'calculatorcvss.calculateCVSS',
    () => {
      vscode.window.showInformationMessage('Calculate CVSS!');
      vscode.window.showInputBox({
        placeHolder: 'Enter CVSS string',
        prompt: 'Enter CVSS base string',
        validateInput: (text) => {
          if (text === '') {
            return 'Please enter a CVSS base score';
          }
          fetch(
            `http://services.nvd.nist.gov/rest/json/cves/2.0?cvssV3Metrics=${text}`
          )
            .then((response) => response.json())
            .then(
              (data: any) =>
                data.vulnerabilities[0].cve.metrics.cvssMetricV30[0].cvssData
                  .baseScore
            )
            .then((baseScore) => {
              const panel = vscode.window.createWebviewPanel(
                'CVSS Base Score',
                'CVSS Base Score',
                vscode.ViewColumn.One,
                {
                  enableScripts: true,
                }
              );

              panel.webview.html = `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                  >
                  <title>Document</title>
                </head>
                <body>
                  <div class="main" data-vscode-context='{"webviewSection": "main", "mouseCount": 4}'>
                    <h1>CVSS Base Score</h1>
                    <p>The CVSS base score is: ${baseScore}</p>
                  </div>
                </body>
                </html>`;

              vscode.window.showInformationMessage(
                `The CVSS base score is: ${baseScore}`
              );
            });
          return null;
        },
        ignoreFocusOut: true,
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
