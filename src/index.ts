import { createExtension, getSelection, message, registerCommand, updateText } from '@vscode-use/utils'
import { toJSON } from './toJSON'
import { toObj } from './utils'

export = createExtension(() => {
  registerCommand('transfer.toJSON', () => {
    const selection = getSelection()!
    const textObj = selection.selectedTextArray[0].replace(/'/g, '"').replace(/\s/g, '')

    if (!/^\{.*\}$/.test(textObj))
      return message.error('请选择一个这样格式的数据{}')
    try {
      const json = toJSON(textObj)
      if (!json)
        return
      updateText((edit) => {
        edit.replace(selection.selection, json)
      })
    }
    catch (error: any) {
      return message.error(error.message)
    }
  })
  registerCommand('transfer.uppercase', () => {
    const selection = getSelection()!

    updateText((edit) => {
      selection.selectionArray.forEach((selection) => {
        const text = selection.text

        try {
          const uppercaseText = text.toUpperCase()
          // 如果本身就是uppercase就直接返回
          if (uppercaseText === text)
            return
          edit.replace(selection.selection, uppercaseText)
        }
        catch (error: any) {
          return message.error(error.message)
        }
      })
    })
  })

  registerCommand('transfer.lowercase', () => {
    const selection = getSelection()!

    updateText((edit) => {
      selection.selectionArray.forEach((selection) => {
        const text = selection.text

        try {
          const lowercaseText = text.toLowerCase()
          // 如果本身就是lowercase就直接返回
          if (lowercaseText === text)
            return
          edit.replace(selection.selection, lowercaseText)
        }
        catch (error: any) {
          return message.error(error.message)
        }
      })
    })
  })

  registerCommand('transfer.objToStr', () => {
    const selection = getSelection()!

    updateText((edit) => {
      selection.selectionArray.forEach((selection) => {
        const text = selection.text

        const textObj = text.replace(/'/g, '"').replace(/\s/g, '').replace(/;/g, ',')

        if (!/^\{.*\}$/.test(textObj))
          return message.error('请选择一个这样格式的数据{}')
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
          edit.replace(selection.selection, str)
        }
        catch (error: any) {
          return message.error(error.message)
        }
      })
    })
  })

  registerCommand('transfer.strToObj', () => {
    const selection = getSelection()!
    updateText((edit) => {
      selection.selectionArray.forEach((selection) => {
        const text = selection.text

        const textStr = text.replace(/'/g, '"').replace(/\s/g, '')

        try {
          const objStr = textStr.split(';').filter(Boolean).reduce((result: string, item: string) => {
            const [key, value] = item.split(':')
            // 将hyphen key转成camelize
            const camelizeKey = key.replace(/-(\w)/g, (match, p1) => p1.toUpperCase())
            const pushValue = `${camelizeKey}:'${value}',`
            return result
              ? `${result}${pushValue}`
              : pushValue
          }, '')

          edit.replace(selection.selection, `{${objStr}}`)
        }
        catch (error: any) {
          return message.error(error.message)
        }
      })
    })
  })

  registerCommand('transfer.reverse', () => {
    const selection = getSelection()!
    updateText((edit) => {
      selection.selectionArray.forEach((selection) => {
        const text = selection.text
        edit.replace(selection.selection, text.split('').reverse().join(''))
      })
    })
  })

  registerCommand('transfer.camel', () => {
    const selection = getSelection()!
    updateText((edit) => {
      selection.selectionArray.forEach((selection) => {
        const text = selection.text
        edit.replace(selection.selection, text.replace(/-(\w)/g, (_: string, v: string) => v.toUpperCase()))
      })
    })
  })

  registerCommand('transfer.hyphen', () => {
    const selection = getSelection()!
    updateText((edit) => {
      selection.selectionArray.forEach((selection) => {
        const text = selection.text
        edit.replace(selection.selection, text.replace(/([A-Z])/g, v => `-${v.toLowerCase()}`))
      })
    })
  })
})
