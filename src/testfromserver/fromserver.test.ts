import * as assert from 'assert';
import * as vscode from 'vscode';

// This suite performs validation tests that look at validating yaml files.
// The tests are looking at if there are any file validation errors, and if there are, what are they.
// 
// These tests need to ensure validation errors are propagated to the ui, we do not need to test
// every type and permutation of validation errors, that should be handled in unit tests.
const extensionId = 'ms-azure-devops.azure-pipelines';

suite ('Extension Setup Tests', function() {
    this.timeout(20000);

    test("Extension is active", async () => {
        // Arrange and Act
        await sleep(2000);
        const started = vscode.extensions.getExtension(extensionId).isActive;

        // Assert
        assert.equal(started, true);
    });
});

// Helpers
// 1. Workspace configuration settings are not as expected
//    console.log('workspace configuration: ' + JSON.stringify(vscode.workspace.getConfiguration()));
// 2. 

suite('Validation Tests From Server', function() {
    this.timeout(200000);

    test ('Validate all files from server', async () => {
        // Arrange
        const validFiles: vscode.Uri[] = await vscode.workspace.findFiles('**/*.yml');

        validFiles.forEach(async (validFile) => {
            // Act
            console.log(`Validating file ${validFile}`);
            const emptyDocument: vscode.TextDocument = await vscode.workspace.openTextDocument(validFile);
            await vscode.window.showTextDocument(emptyDocument);
            await sleep(500); // Give it time to show the validation errors, if any
            const diagnostics: vscode.Diagnostic[] = vscode.languages.getDiagnostics(validFile);

            // Assert
            assert.equal(emptyDocument.languageId, 'azure-pipelines');
            assert.equal(diagnostics.length, 0);
        });
    });
});

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
