import { createExtension, createSelect, executeCommand, getSelection, message, registerCommand, updateText, getActiveTextEditor } from '@vscode-use/utils'
import { toJSON } from './toJSON'
import { toObj } from './utils'
import * as path from 'path'

export = createExtension(() => {
  registerCommand('transfer.transfer', async () => {
    const select = await createSelect([
      {
        label: 'toJSON',
        description: 'json格式化',
      },
      {
        label: 'uppercase',
        description: '转换为大写',
      },
      {
        label: 'lowercase',
        description: '转换为小写',
      },
      {
        label: 'objToStr',
        description: '对象转字符串',
      },
      {
        label: 'strToObj',
        description: '字符串转对象',
      },
      {
        label: 'reverse',
        description: '反转字符串',
      },
      {
        label: 'camel',
        description: '转驼峰',
      },
      {
        label: 'bigCamel',
        description: '转大驼峰',
      },
      {
        label: 'hyphen',
        description: '驼峰转连字符',
      },
      {
        label: 'toRelativePath',
        description: '转换为相对路径',
      },
    ])
    if (!select)
      return
    const command = `transfer.${select}`
    // 触发这个命令
    executeCommand(command)
  })
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

  registerCommand('transfer.bigCamel', () => {
    const selection = getSelection()!
    updateText((edit) => {
      selection.selectionArray.forEach((selection) => {
        const text = selection.text
        edit.replace(selection.selection, text[0].toLocaleUpperCase() + text.slice(1).replace(/-(\w)/g, (_: string, v: string) => v.toUpperCase()))
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

  registerCommand('transfer.toRelativePath', () => {
    const selection = getSelection()!
    const activeEditor = getActiveTextEditor()
    
    if (!activeEditor) {
      return message.error('没有活动的编辑器')
    }

    const currentFilePath = activeEditor.document.uri.fsPath
    const currentDir = path.dirname(currentFilePath)

    updateText((edit) => {
      selection.selectionArray.forEach((selection) => {
        const selectedPath = selection.text.trim()
        
        try {
          // 检查是否是绝对路径
          if (!path.isAbsolute(selectedPath)) {
            return message.error('选中的文本不是绝对路径')
          }

          // 计算相对路径
          const relativePath = path.relative(currentDir, selectedPath)
          
          // 如果相对路径不以 . 开头，则添加 ./
          const finalPath = relativePath.startsWith('.') ? relativePath : `./${relativePath}`
          
          edit.replace(selection.selection, finalPath)
        }
        catch (error: any) {
          return message.error(`转换路径失败: ${error.message}`)
        }
      })
    })
  })
})
