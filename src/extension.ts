// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "calculatorcvss" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    'calculatorcvss.calculateCVSS',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
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
                  <h1>CVSS Base Score</h1>
                  <p>The CVSS base score is: ${baseScore}</p>
                </body>
                </html>`;
              vscode.commands.executeCommand(
                'vscode.open',
                vscode.Uri.parse(
                  `http://services.nvd.nist.gov/rest/json/cves/2.0?cvssV3Metrics=${text}`
                )
              );

              // vscode.window.showTextDocument(vscode.Uri.parse(baseScore));
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

// This method is called when your extension is deactivated
export function deactivate() {}
