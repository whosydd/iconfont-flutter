import * as vscode from 'vscode'
import generate from './utils/generate'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('iconfont-flutter.generate', generate)

  context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
