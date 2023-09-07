export function toObj(code: string) {
  const jsStr = `return (function() { ${code} })();`
  // eslint-disable-next-line no-new-func
  const func = new Function(jsStr)
  return func()
}
