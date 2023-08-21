import * as vscode from 'vscode'
import {updateText} from '@vscode-use/utils'

export function activate(context: any) {
  const jsonifyDisposable = vscode.commands.registerTextEditorCommand('transfer.toJSON', async (textEditor) => {
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

  const uppercaseDisposable = vscode.commands.registerTextEditorCommand('transfer.uppercase', async (textEditor) => {
    const doc = textEditor.document
    const selections: readonly vscode.Selection [] = textEditor.selections

    updateText(edit=>{
      selections.forEach((selection) => {
        const text = doc.getText(selection)
  
        try {
          const uppercaseText = text.toUpperCase()
          // 如果本身就是uppercase就直接返回
          if (uppercaseText === text)
            return
            edit.replace(selection, uppercaseText)
        }
        catch (error: any) {
          return vscode.window.showErrorMessage(error.message)
        }
      })
    })
  })

  const lowercaseDisposable = vscode.commands.registerTextEditorCommand('transfer.lowercase', async (textEditor) => {
    const doc = textEditor.document
    const selections: readonly vscode.Selection [] = textEditor.selections
 
    updateText(edit=>{
      selections.forEach((selection) => {
        const text = doc.getText(selection)
  
        try {
          const lowercaseText = text.toLowerCase()
          // 如果本身就是uppercase就直接返回
          if (lowercaseText === text)
            return
            edit.replace(selection, lowercaseText)
        }
        catch (error: any) {
          return vscode.window.showErrorMessage(error.message)
        }
      })
    })
  })

  const objToStringDisposable = vscode.commands.registerTextEditorCommand('transfer.objToStr', async (textEditor) => {
    const doc = textEditor.document
    const selections: readonly vscode.Selection [] = textEditor.selections

    updateText(edit=>{
      selections.forEach((selection) => {
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
            edit.replace(selection, str)
        }
        catch (error: any) {
          return vscode.window.showErrorMessage(error.message)
        }
      })
    })
  })

  const stringToObjDisposable = vscode.commands.registerTextEditorCommand('transfer.strToObj', async (textEditor) => {
    const doc = textEditor.document
    const selections: readonly vscode.Selection [] = textEditor.selections


    updateText(edit=>{
      selections.forEach((selection) => {
        const text = doc.getText(selection)
  
        const textStr = text.replace(/'/g, '"').replace(/[\n\t\s]/g, '')
  
        try {
          const objStr = textStr.split(';').filter(Boolean).reduce((result, item) => {
            const [key, value] = item.split(':')
            // 将hyphen key转成camelize
            const camelizeKey = key.replace(/-(\w)/g, (match, p1) => p1.toUpperCase())
            const pushValue = `${camelizeKey}:'${value}',`
            return result
              ? `${result}${pushValue}`
              : pushValue
          }, '')
  
          edit.replace(selection, `{${objStr}}`)
        }
        catch (error: any) {
          return vscode.window.showErrorMessage(error.message)
        }
      })
    })
  })

  const reverseDisposable = vscode.commands.registerTextEditorCommand('transfer.reverse', async (textEditor) => {
    const doc = textEditor.document
    const selections: readonly vscode.Selection [] = textEditor.selections
    updateText(edit=>{
      selections.forEach((selection) => {
        const text = doc.getText(selection)
        edit.replace(selection, text.split('').reverse().join(''))
      })
    })
  })

  const camelDisposable = vscode.commands.registerTextEditorCommand('transfer.camel', async (textEditor) => {
    const doc = textEditor.document
    const selections: readonly vscode.Selection [] = textEditor.selections
    updateText(edit=>{
      selections.forEach((selection) => {
        const text = doc.getText(selection)
        edit.replace(selection, text.replace(/-(\w)/g, (_, v) => v.toUpperCase()))
      })
    })
  })

  const hypenDisposable = vscode.commands.registerTextEditorCommand('transfer.hypen', async (textEditor) => {
    const doc = textEditor.document
    const selections: readonly vscode.Selection [] = textEditor.selections
    updateText(edit=>{
      selections.forEach((selection) => {
        const text = doc.getText(selection)
        edit.replace(selection, text.replace(/([A-Z])/g, v => `-${v.toLowerCase()}`))
      })
    })
  })

  context.subscriptions.push(hypenDisposable, camelDisposable, reverseDisposable, jsonifyDisposable, lowercaseDisposable, uppercaseDisposable, objToStringDisposable, stringToObjDisposable)
}

export function deactivate() {

}
function toObj(code: string) {
  const jsStr = `return (function() { ${code} })();`
  // eslint-disable-next-line no-new-func
  const func = new Function(jsStr)
  return func()
}
