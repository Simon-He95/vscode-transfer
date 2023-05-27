import * as vscode from 'vscode'

export function activate(context: any) {
  const jsonifyDisposable = vscode.commands.registerTextEditorCommand('extension.toJSON', async (textEditor) => {
    const doc = textEditor.document
    const selection: vscode.Selection | vscode.Range = textEditor.selection
    const text = doc.getText(selection)
    const textObj = text.replace(/'/g, '"').replace(/[\n\t\s]/g, '')

    if (!/^{.*}$/.test(textObj))
      return vscode.window.showErrorMessage('请选择一个这样格式的数据{}')
    try {
      const obj = toObj(`const variable = ${textObj}; return variable`)
      // 如果本身就是json就直接返回
      if (obj === textObj)
        return
      textEditor.edit(builder =>
        builder.replace(selection, JSON.stringify(obj)),
      )
    }
    catch (error: any) {
      return vscode.window.showErrorMessage(error.message)
    }
  })

  context.subscriptions.push(jsonifyDisposable)
}

export function deactivate() {

}
function toObj(code: string) {
  const jsStr = `return (function() { ${code} })();`
  // eslint-disable-next-line no-new-func
  const func = new Function(jsStr)
  return func()
}
