// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch from 'node-fetch';

async function findIt(paramName: string) {
	if (paramName !== 'ml' && paramName !== 'sl') {
		vscode.window.showInformationMessage('Unknown parameter');
	}
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showInformationMessage('Editor does not exist');
		return;
	}
	const text = editor.document.getText(editor.selection);
	if (!text) {
		vscode.window.showInformationMessage('No text selected');
		return;
	}
	const response = await fetch(`https://api.datamuse.com/words?${paramName}=${text.replace(' ', '+')}`);
	const data = await response.json();
	const quickPick = vscode.window.createQuickPick();
	quickPick.items = data.map((x: any) => ({ label: x.word }));
	quickPick.onDidChangeSelection(([selection]) => {
		if (selection) {
			// vscode.window.showInformationMessage(`Picked text: ${selection.label}`);
			editor.edit(edit => {
				edit.replace(editor.selection, selection.label);
			});
			quickPick.dispose();
		}
	});
	quickPick.onDidHide(() => quickPick.dispose());
	quickPick.show();
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "synonym-finder" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const synonymCommand = vscode.commands.registerCommand('synonym-finder.find-synonym', async () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from synonym-finder!');
		await findIt('ml');
	});
	context.subscriptions.push(synonymCommand);

	const soundCommand = vscode.commands.registerCommand('synonym-finder.find-sound', async () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from synonym-finder!');
		await findIt('sl');
	});
	context.subscriptions.push(soundCommand);

	// Listen for Save event
	const onSaveTextEvent = vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		vscode.window.showInformationMessage(`synonym-finder has detect a save event on ${document.fileName}`);
	});
	context.subscriptions.push(onSaveTextEvent);

	// Listen for Open event
	const onOpenTextEvent = vscode.workspace.onDidOpenTextDocument((document: vscode.TextDocument) => {
		vscode.window.showInformationMessage(`synonym-finder has detect an open event on ${document.fileName}`);
	});
	context.subscriptions.push(onOpenTextEvent);
}

// this method is called when your extension is deactivated
export function deactivate() { }
