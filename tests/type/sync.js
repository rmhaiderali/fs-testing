import fs from "node:fs"

function s(api) {
  return (...args) =>
    new Promise((r) => {
      try {
        r({ err: null, data: fs[api](...args) })
      } catch (err) {
        r({ err, data: null })
      }
    })
}

export default {
  open: s("openSync"),
  access: s("accessSync"),
  writeFile: s("writeFileSync"),
  readFile: s("readFileSync"),
  appendFile: s("appendFileSync"),
  unlink: s("unlinkSync"),
  stat: s("statSync"),
}
