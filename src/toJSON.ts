import { toObj } from './utils'

export function toJSON(str: string) {
  try {
    const obj = toObj(`const variable = ${str}; return variable`)
    return JSON.stringify(obj, null, 2)
  }
  catch (error) {

  }
}
