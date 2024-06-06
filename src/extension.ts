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
            .then((data: any) => data.vulnerabilities[0])
            .then((vuln) => {
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
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <title>CVSS Calculator</title>
  </head>
  <body>
    <div
      class="main"
      data-vscode-context='{"webviewSection": "main", "mouseCount": 4}'
    >
      <h1>CVSS Informations</h1>
      <hr width="100%" />
      </div>
      <div class="body">
        <p>
          The severity is:
          ${vuln.cve.metrics.cvssMetricV30[0].cvssData.baseSeverity}
        </p>
        <p>
          The base score is:
          ${vuln.cve.metrics.cvssMetricV30[0].cvssData.baseScore}
        </p>
        
        <p>
          The exploitability score is:
          ${vuln.cve.metrics.cvssMetricV30[0].exploitabilityScore}
        </p>
        <p>
          The impact score is: ${vuln.cve.metrics.cvssMetricV30[0].impactScore}
        </p>
      </div>
      <hr width="100%" />
      <h1>CVE informations</h1>
      <div class="body">
        <h3>The CVE ID is: ${vuln.cve.id}</h3>
        <h3>The source identifier is: ${vuln.cve.sourceIdentifier}</h3>
        <h3>
          The description is: ${vuln.cve.descriptions[0].value}
        </h3>
        <h3>The published date is: ${vuln.cve.published}</h3>
        <h3>The status is: ${vuln.cve.vulnStatus}</h3>
      </div>
    
  </body>
  <style>
    body {
    background-color: rgb(31 41 55);
    color: rgb(226 232 240);
    border-radius: 10px;
          font-family: "Inter", sans-serif;
      font-optical-sizing: auto;
      font-style: normal;
      font-variation-settings: "slnt" 0;
    }
              
    .main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: start;
      width: 100vw;
    }

    .body {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: start;
      width: 100vw;
      padding: 1rem;
      border: 1px solid rgb(226 232 240);
      border-radius: 10px;
    }

    p {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }
  </style>
</html>

`;

              vscode.window.showInformationMessage(
                `The CVSS base score is: ${vuln.cve.metrics.cvssMetricV30[0].cvssData.baseScore}`
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
