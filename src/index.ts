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

  const uppercaseDisposable = vscode.commands.registerTextEditorCommand('extension.uppercase', async (textEditor) => {
    const doc = textEditor.document
    const selection: vscode.Selection | vscode.Range = textEditor.selection
    const text = doc.getText(selection)

    try {
      const uppercaseText = text.toUpperCase()
      // 如果本身就是uppercase就直接返回
      if (uppercaseText === text)
        return
      textEditor.edit(builder =>
        builder.replace(selection, uppercaseText),
      )
    }
    catch (error: any) {
      return vscode.window.showErrorMessage(error.message)
    }
  })

  const objToStringDisposable = vscode.commands.registerTextEditorCommand('extension.objToString', async (textEditor) => {
    const doc = textEditor.document
    const selection: vscode.Selection | vscode.Range = textEditor.selection
    const text = doc.getText(selection)

    const textObj = text.replace(/'/g, '"').replace(/[\n\t\s]/g, '').replace(/;/g, ',')

    if (!/^{.*}$/.test(textObj))
      return vscode.window.showErrorMessage('请选择一个这样格式的数据{}')
    try {
      const obj = toObj(`const variable = ${textObj}; return variable`)

      const str = Object.keys(obj).reduce((result, key) => {
        const value = obj[key]
        // 将key转成hyphen
        const hyphenKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
        const pushValue = `${hyphenKey}:${value};`

        return result
          ? `${result}${pushValue}`
          : `${pushValue}`
      }, '')
      textEditor.edit(builder =>
        builder.replace(selection, str),
      )
    }
    catch (error: any) {
      return vscode.window.showErrorMessage(error.message)
    }
  })

  context.subscriptions.push(jsonifyDisposable, uppercaseDisposable, objToStringDisposable)
}

export function deactivate() {

}
function toObj(code: string) {
  const jsStr = `return (function() { ${code} })();`
  // eslint-disable-next-line no-new-func
  const func = new Function(jsStr)
  return func()
}
